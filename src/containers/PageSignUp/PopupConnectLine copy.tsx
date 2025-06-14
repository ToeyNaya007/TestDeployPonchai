import React, { useState, useEffect } from 'react';
import Input from 'shared/Input/Input';
import lineSvg from 'images/line.svg';
import { useNavigate } from 'react-router-dom';
import AlertService from 'components/AlertServicce';
import { useOptions } from 'containers/OptionsContext';

interface PopupConnectLineProps {
    togglePopup: () => void;
    isOpen: boolean;
}

const PopupConnectLine: React.FC<PopupConnectLineProps> = ({ togglePopup, isOpen }) => {
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [ErrorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        userIdLine: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setStep(1);
            setErrorMessage('');
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                userIdLine: '',
            });
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckUser = async () => {
        if (!formData.userIdLine.trim()) {
            setErrorMessage('User ID Line ไม่สามารถเป็นค่าว่างได้');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${basePath}api/TestAPI/register.php/checkUserLineID`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userLineID: formData.userIdLine }),
            });
            const data = await response.json();
            if (data.exists) {
                AlertService.showSuccess('เข้าสู่ระบบสำเร็จ!', 'คุณได้เข้าสู่ระบบเรียบร้อยแล้ว', 2000);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setErrorMessage('');
                setStep(2);
            }
        } catch (error) {
            AlertService.showError('เกิดข้อผิดพลาด!', '', 2000);
            setTimeout(() => {
            }, 2000);
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!formData.firstName.trim() || !formData.lastName) {
            setErrorMessage('ชื่อและนามสกุล ไม่สามารถเป็นค่าว่างได้');
            return;
        }
        try {
            const response = await fetch(`${basePath}api/TestAPI/register.php/line-register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    userIDLine: formData.userIdLine
                }),
            });

            const textResponse = await response.text();
            const data = JSON.parse(textResponse);
            if (response.ok) {
                const response = await fetch(`${basePath}api/TestAPI/register.php/checkUserLineID`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userLineID: formData.userIdLine }),
                });
                const data = await response.json();
                if (data.exists) {
                    AlertService.showSuccess('สมัครสมาชิกสำเร็จ!', 'คุณได้เข้าสู่ระบบเรียบร้อยแล้ว', 2000);
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    AlertService.showError('เกิดข้อผิดพลาด!', 'โปรดลองอีกครั้ง', 2000);
                    setTimeout(() => {
                        navigate('/signup');
                    }, 2000);
                }
            } else {

            }
        } catch (error) {
            console.error("Registration failed", error);
        }
    };

    const nextStep = () => setStep(prevStep => prevStep + 1);
    const prevStep = () => setStep(prevStep => Math.max(prevStep - 1, 1));

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/80 pt-0 overflow-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`h-full max-h-[40rem] md:max-h-[34rem] bg-slate-50 dark:bg-slate-800 px-6 py-7 border border-t-4 border-t-red-500 space-y-4 sm:space-y-6 rounded-lg w-full max-w-[56rem] shadow-lg transform transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} `}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center bg-green-600 p-2 rounded-lg text-white">
                        <h2 className="text-xl font-semibold">เข้าสู่ระบบด้วย LINE</h2>
                        <img className="w-8 ml-2" src={lineSvg} alt="เข้าสู่ระบบด้วย line" />
                    </div>
                    <div className="ml-10">
                        <button onClick={togglePopup}>
                            <i className="text-3xl las la-times-circle"></i>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>1</div>
                    <div className={`flex-1 h-1 ${step > 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>2</div>
                </div>

                {step === 1 && (
                    <div>
                        <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">User ID Line</label>
                        <div className="mt-1.5 flex w-full md:w-1/2">
                            <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                <i className="text-2xl las la-id-badge"></i>
                            </span>
                            <Input
                                name="userIdLine"
                                value={formData.userIdLine}
                                onChange={handleInputChange}
                                className="!rounded-l-none"
                            />
                        </div>
                        {ErrorMessage && <div className="text-red-500 mt-2">{ErrorMessage}</div>}
                        <button onClick={handleCheckUser} className="mt-6 bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-800 rounded-full py-3 px-6 hover:bg-slate-800">
                            เข้าสู่ระบบ
                        </button>

                        {/* Loading animation */}
                        {loading && (
                            <div className="flex justify-center mt-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-black"></div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2>ลงทะเบียน</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 pt-2">
                            <div>
                                <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">ชื่อ</label>
                                <div className="mt-1.5 flex">
                                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                        <i className="text-2xl las la-user"></i>
                                    </span>
                                    <Input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="!rounded-l-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="nc-Label font-medium text-neutral-900 dark:text-neutral-200 text-sm">นามสกุล</label>
                                <div className="mt-1.5 flex">
                                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                        <i className="text-2xl las la-user"></i>
                                    </span>
                                    <Input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="!rounded-l-none"
                                    />
                                </div>
                            </div>
                        </div>
                        {ErrorMessage && <div className="text-red-500 mt-2">{ErrorMessage}</div>}
                        <button onClick={handleRegister} className="mt-6 bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-800 rounded-full py-3 px-6 hover:bg-slate-800">
                            สมัครสมาชิก
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopupConnectLine;
