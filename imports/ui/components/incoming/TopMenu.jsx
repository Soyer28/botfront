import React from 'react';
import PropTypes from 'prop-types';

import { Menu } from 'semantic-ui-react';

import LanguageDropdown from '../common/LanguageDropdown';

const TopMenu = ({
    projectLanguages,
    selectedLanguage,
    handleLanguageChange,
    activeTab,
    tabs,
    onClickTab,
    className,
}) => {
    const renderTabs = () => (
        tabs.map(({ value, text }) => (
            <Menu.Item
                content={text}
                key={value}
                data-cy={value}
                active={value === activeTab}
                onClick={() => onClickTab(value)}
            />
        ))
    );
    return (
        <Menu borderless className={`top-menu ${className}`}>
            <div className='language-container'>
                <Menu.Item header borderless className='language-item'>
                    {['conversations', 'forms'].includes(activeTab) ? (
                        <></>
                    ) : (
                        <LanguageDropdown
                            languageOptions={projectLanguages}
                            selectedLanguage={selectedLanguage}
                            handleLanguageChange={handleLanguageChange}
                        />
                    )}
                </Menu.Item>
            </div>
            <div className='incoming-tabs'>
                {renderTabs()}
            </div>
        </Menu>
    );
};

TopMenu.propTypes = {
    projectLanguages: PropTypes.array.isRequired,
    selectedLanguage: PropTypes.string,
    handleLanguageChange: PropTypes.func.isRequired,
    activeTab: PropTypes.string,
    tabs: PropTypes.array,
    className: PropTypes.string,
    onClickTab: PropTypes.func,
};

TopMenu.defaultProps = {
    selectedLanguage: '',
    className: '',
    activeTab: null,
    tabs: [],
    onClickTab: () => {},
};

export default TopMenu;
