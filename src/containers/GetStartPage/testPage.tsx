import { useOptions } from 'containers/OptionsContext';
import { useState, useEffect } from 'react'

const TestPage = () => {
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const [data, setData] = useState(null);
    //test API page
    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const response = await fetch(`${basePath}/api/getProduct/frontEnd/testAPI.php`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setData(data.results.product);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        };
        if (basePath) {
            fetchTestData();
        }
    }, [basePath]);
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-6 text-center">Test Page</h1>
            <p className="text-center">This is a test page.</p>
            <p className="text-center">{data ? JSON.stringify(data, null, 2) : 'Loading...'}</p>
        </div>
    )
}

export default TestPage