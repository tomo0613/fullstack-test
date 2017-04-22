import React from 'react';
import { connect } from 'react-redux';
import modalActions from 'actions/modalActions';
import Modals from 'components/modals/Modals.react';
import Icon from 'components/common/Icon.react';

class ModalContainer extends React.Component {
    constructor(props) {
        super(props);

        this.createModalHeader = this.createModalHeader.bind(this);
        this.createModalBody = this.createModalBody.bind(this);
    }
    render() {
        console.log(this.props.currentModalId);
        if (!this.props.currentModalId) {
            return null;
        }
        const modal = Modals(this.props.currentModalId);
        return React.DOM.div(
            {
                id: 'modalContainer',
                onClick: (e) => {
                    if (e.target.id === 'modalContainer') {
                        modalActions.close();
                    }
                },
                onKeyDown: (e) => {
                    //TODO focus
                    if (e.key === 'Escape') {
                        modalActions.close();
                    }
                }
            },
            React.DOM.div(
                {id: 'modalWindow'},
                this.createModalHeader(modal),
                this.createModalBody(modal)
            )
        )
    }
    createModalHeader(modal) {
        return React.DOM.div(
            {id: 'modalHeader'},
            modal.title && React.DOM.label({}, modal.title),
            React.DOM.i(
                {onClick: modalActions.close},
                Icon.create('close')
            )
        );
    }
    createModalBody(modal) {
        return React.DOM.div(
            {
                id: 'modalBody',
                style: modal.dimensions
            },
            modal.create()
        );
    }
}

function getProps(store) {
    return {
        currentModalId: store.modalStore.currentModalId
    };
}

export default connect(getProps)(ModalContainer);
