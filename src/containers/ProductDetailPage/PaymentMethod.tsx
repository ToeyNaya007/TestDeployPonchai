interface PaymentMethodProps {
    paymentMethod?: number;
    setPaymentMethod: (value: number) => void;
    paymentMethods: Array<{ value: number; label: string; description: string }>;
  }
  
  const PaymentMethod: React.FC<PaymentMethodProps> = ({ paymentMethod, setPaymentMethod, paymentMethods }) => {
    const handlePaymentSelect = (value: number) => {
      setPaymentMethod(value);
    };
  
    return (
      <div>
        <div className="flex justify-between mt-2 mb-10 space-x-3 sm:space-x-4">
          {paymentMethods.map((method) => (
            <div
              key={method.value}
              className={`flex-1 p-2 rounded-md cursor-pointer shadow-md ${
                paymentMethod === method.value
                  ? 'border-2 border-green-500 bg-white dark:bg-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800'
              }`}
              onClick={() => handlePaymentSelect(method.value)}
            >
              <input
                type="radio"
                id={`payment-${method.value}`}
                name="paymentMethod"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={() => handlePaymentSelect(method.value)}
                className="hidden"
              />
              <label htmlFor={`payment-${method.value}`} className="flex items-center cursor-pointer">
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    paymentMethod === method.value
                      ? 'border-[1.5px] border-blue-600 bg-blue-600 text-white'
                      : 'border-[1.5px] border-gray-600 bg-white'
                  }`}
                >
                  {paymentMethod === method.value && (
                    <span className="h-[6px] w-[6px] bg-white rounded-full"></span>
                  )}
                </span>
                <span className="ml-2 font-semibold">{method.label}</span>
              </label>
              <p className="mt-2 cursor-default text-sm">{method.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default PaymentMethod;
  