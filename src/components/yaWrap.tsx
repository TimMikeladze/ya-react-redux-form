import * as React from 'react';
import { PropTypes } from 'react';

const yaWrap = (field) => {
    class Wrapper extends React.Component<any, any> {
        public static contextTypes = {
            name: PropTypes.string,
        };
        public static propTypes = {
          //name: PropTypes.string.isRequired,
          value: PropTypes.string,
        };
        constructor(props) {
            super(props);
            this.getFormName = this.getFormName.bind(this);
        }
        public componentWillMount() {
            //const { name, value } = this.props;
            //const formName = this.getFormName();
            //this.props.createField({ formName, name, value });
        }
        public componentWillUnmount() {
            //const { name } = this.props;
            //const formName = this.getFormName();
            //this.props.removeField({ formName, name });
        }
        public render() {
            return (
                <div>
                </div>
            );
        }
        private getFormName() {
            if (!(this.props.formName instanceof String)
                && (this.context === undefined || (this.context && !this.context.hasOwnProperty('formName')))) {
                throw new Error('A formName prop or a formName context type must be provided to YaWrap');
            }
            return this.props.formName || (this.context as any).name;
        }
    };
    return <Wrapper />;
};

export default yaWrap;
