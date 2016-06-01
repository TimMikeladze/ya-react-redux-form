import * as React from 'react';
import { PropTypes } from 'react';

const yaWrap = (field) => {
    class Wrapper extends React.Component<any, any> {
        public static contextTypes = {
            form: PropTypes.string,
        };
        public static propTypes = {
          element: PropTypes.element.isRequired,
        };
        constructor(props) {
            super(props);
            this.getFormName = this.getFormName.bind(this);
        }
        public componentWillMount() {
            const { name, value } = this.props.element.props;
            const form = this.getFormName();
            //this.props.createField({ formName, name, value });
        }
        public componentWillUnmount() {
            const { name } = this.props.element.props;
            const form = this.getFormName();
            //this.props.removeField({ formName, name });
        }
        public render() {
            return (
                <div>
                </div>
            );
        }
        private getFormName() {
          if ((this.props.element.props.form === undefined || this.props.element.props.form.length === 0)
            && ((this.context as any).form === undefined || (this.context as any).form.length === 0)) {
            throw new Error('A form prop or a form context type must be provided to YaWrap');
          }
          return this.props.element.props.form || (this.context as any).form;
        }
    };

    return <Wrapper element={field} />;
};

export default yaWrap;
