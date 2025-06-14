import DropdownCategory from 'components/DropdownCategory'
import PromotionImages from 'components/PromotionImages'
import { useOptions } from 'containers/OptionsContext';
import { useEffect, useState } from 'react';

const SectionFirstPage = () => {
    const { getOptionByName } = useOptions();
    const basePath = getOptionByName('basePathAdmin');
    const [showBranner, setShowBranner] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (basePath) {
            const fetchShowBranner = async () => {
                try {
                    const response = await fetch(`${basePath}api/options/frontend/getBrannerOption.php`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    });

                    const data = await response.json();

                    if (data.results && typeof data.results.option !== 'undefined') {
                        setShowBranner(data.results.option);
                        setLoading(false);
                    } else {
                        console.error('No categories found');
                    }
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };

            fetchShowBranner();
        }
    }, [basePath]);

    return (
        <>
            {showBranner === 1 ? (
                <div className="flex flex-col lg:flex-row">
                    <DropdownCategory />
                    <PromotionImages />
                </div>
            ) : (
                <></>
            )}
        </>

    )
}

export default SectionFirstPage