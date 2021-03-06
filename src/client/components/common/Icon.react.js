import React from 'react';

//TODO create separate module
const icons = {
    close: `
        M672 256l-160 160-160-160-96 96 160 160-160 160 96 96 160-160 160 160 96-96-160-160 160-160z
        M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512z
        M512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416z
    `,
    error: `
        M512 96c-111.118 0-215.584 43.272-294.156 121.844s-121.844 183.038-121.844 294.156c0 111.118
        43.272 215.584 121.844 294.156s183.038 121.844 294.156 121.844c111.118 0
        215.584-43.272 294.156-121.844s121.844-183.038
        121.844-294.156c0-111.118-43.272-215.584-121.844-294.156s-183.038-121.844-294.156-121.844z
        M512 0v0c282.77 0 512 229.23 512 512s-229.23 512-512 512c-282.77 0-512-229.23-512-512s229.23-512 512-512z
        M448 704h128v128h-128zM448 192h128v384h-128z
    `,
    failure: ``,
    info: `
        M448 304c0-26.4 21.6-48 48-48h32c26.4 0 48 21.6 48 48v32c0 26.4-21.6 48-48 48h-32c-26.4 0-48-21.6-48-48v-32z
        M640 768h-256v-64h64v-192h-64v-64h192v256h64z
        M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512z
        M512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416z
    `,
    signOut: `
        M768 640v-128h-320v-128h320v-128l192 192z
        M704 576v256h-320v192l-384-192v-832h704v320h-64v-256h-512l256 128v576h256v-192z
    `,
    success: `
        M384 690l452-452 60 60-512 512-238-238 60-60z
    `,
    user: `
        M576 706.612v-52.78c70.498-39.728 128-138.772 128-237.832 0-159.058 0-288-192-288s-192 128.942-192 288c0 99.060
        57.502 198.104 128 237.832v52.78c-217.102 17.748-384 124.42-384 253.388h896c0-128.968-166.898-235.64-384-253.388z
    `,
    warning: `
        M512 92.8L941 948H83L512 92.8z
        M512 0c-22 0-44 15-61 44.6L14 915.8C-19.4 975.3 9 1024 77.3 1024h869.4c68.3 0 96.7-48.7 63.3-108.2L573 44.6C556 15 534 0 512 0z
        M576 832c0 35.3-28.7 64-64 64s-64-28.7-64-64 28.7-64 64-64 64 28.7 64 64z
        M512 704c-35.3 0-64-28.7-64-64V448c0-35.3 28.7-64 64-64s64 28.7 64 64v192c0 35.3-28.7 64-64 64z
    `
};

class Icon extends React.Component {
    render() {
        const props = this.props;
        const path = icons[props.icon];
        const style = {
            svg: {
                display: 'inline-block',
                verticalAlign: 'middle',
            },
            path: {
                fill: props.color,
            }
        };

        return React.DOM.svg(
            {style: style.svg, width: props.size + 'px', height: props.size + 'px', viewBox: '0 0 1024 1024'},
            React.DOM.path({style: style.path, d: path})
        );
    }
}

Icon.defaultProps = {
    size: 16
}

Icon.create = (icon, props = {}) => {
    props.icon = icon;
    return React.createElement(Icon, props);
};

export default Icon;
