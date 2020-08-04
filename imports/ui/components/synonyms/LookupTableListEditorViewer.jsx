/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import LookupTableListEditor from './LookupTableListEditor';
import LookupTableListViewer from './LookupTableListViewer';

export default class LookupTableListEditorViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { edit: false };
    }

    setEditMode = () => {
        const { edit } = this.state;
        if (!edit) this.setState({ edit: true });
    };

    onEditDone = (entitySynonym) => {
        const { onEdit } = this.props;
        this.setState({ edit: false });
        onEdit(entitySynonym);
    };

    render() {
        const { edit } = this.state;
        const { entitySynonym, listAttribute } = this.props;
        return (
            <div onClick={this.setEditMode}>
                {edit && <LookupTableListEditor listAttribute={listAttribute} entitySynonym={entitySynonym} onDone={this.onEditDone} />}
                {!edit && <LookupTableListViewer listAttribute={listAttribute} entitySynonym={entitySynonym} />}
            </div>
        );
    }
}

LookupTableListEditorViewer.propTypes = {
    entitySynonym: PropTypes.object,
    onEdit: PropTypes.func.isRequired,
    listAttribute: PropTypes.string.isRequired,
};

LookupTableListEditorViewer.defaultProps = {
    entitySynonym: {},
};