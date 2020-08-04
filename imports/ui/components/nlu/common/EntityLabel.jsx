import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import EntityPopup from '../../example_editor/EntityPopup';
import { ProjectContext } from '../../../layouts/context';
import getColor from '../../../../lib/getColors';

function Entity({
    value, onChange, onDelete, allowEditing, deletable, color,
}) {
    const { entities } = useContext(ProjectContext);
    const colorToRender = color || getColor(value.entity, true);
    return (
        <EntityPopup
            entity={value}
            onAddOrChange={onChange}
            onDelete={() => onDelete()}
            options={[...new Set([...entities, value.entity])].map(e => ({
                text: e,
                value: e,
            }))}
            deletable={deletable}
            length={value.start ? value.end - value.start : 0}
            trigger={(
                <div data-cy='entity-label' className={`entity-container ${colorToRender}`}>
                    <span className='float'>{value.entity}</span>
                    <div>{value.value}</div>
                </div>
            )}
            key={`${value.start || value.entity}${value.end || ''}`}
            disabled={!allowEditing}
        />
    );
}

Entity.propTypes = {
    onChange: PropTypes.func.isRequired,
    color: PropTypes.string,
    onDelete: PropTypes.func,
    deletable: PropTypes.bool,
    value: PropTypes.object.isRequired,
    allowEditing: PropTypes.bool,
};

Entity.defaultProps = {
    onDelete: () => {},
    deletable: false,
    allowEditing: false,
    color: null,
};

export default Entity;
