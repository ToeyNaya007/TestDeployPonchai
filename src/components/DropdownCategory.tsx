import React from 'react'
import MultilevelDropdownMobile from './MultilevelDropdownMobile'
import MultiLevelDropdown from './MultiLevelDropdown'

const DropdownCategory = () => {
    return (
        <div className='pt-0.5'>
            <div className='lg:hidden'>
                <MultilevelDropdownMobile />
            </div>
            <div className='hidden lg:block' >
                <MultiLevelDropdown />
            </div>
        </div>
    )
}

export default DropdownCategory