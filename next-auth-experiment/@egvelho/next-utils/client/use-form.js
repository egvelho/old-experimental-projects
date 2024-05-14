"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useForm = void 0;
const tslib_1 = require("tslib");
const react_1 = require("react");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function mapStateToForm(state, values, classConstructor, errors) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (errors === undefined) {
            errors = yield class_validator_1.validate(class_transformer_1.plainToClass(classConstructor, state));
        }
        const errors_ = errors.reduce((stack, { property, constraints }) => (Object.assign(Object.assign({}, stack), { [property]: Object.values(constraints !== null && constraints !== void 0 ? constraints : {}) })), {});
        return Object.keys(state).reduce((stack, key) => {
            var _a;
            return Object.assign(Object.assign({}, stack), { [key]: Object.assign(Object.assign({}, values[key]), { value: state[key], errors: (_a = errors_[key]) !== null && _a !== void 0 ? _a : [] }) });
        }, {});
    });
}
function getInitialForm(state) {
    return Object.keys(state).reduce((stack, key) => {
        return Object.assign(Object.assign({}, stack), { [key]: {
                value: state[key],
                focus: false,
                touched: false,
                errors: [],
            } });
    }, {});
}
function useForm(classConstructor, initialState) {
    const [state, setState] = react_1.useState(initialState);
    const [form, setForm] = react_1.useState(getInitialForm(initialState));
    react_1.useEffect(() => {
        mapStateToForm(state, form, classConstructor).then(setForm);
    }, []);
    react_1.useEffect(() => {
        mapStateToForm(state, form, classConstructor).then(setForm);
    }, [state]);
    return {
        state,
        form,
        reset() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const initialForm = Object.keys(form).reduce((stack, key) => (Object.assign(Object.assign({}, stack), { [key]: {
                        touched: false,
                        focus: false,
                        value: initialState[key],
                        errors: [],
                    } })), {});
                const nextForm = yield mapStateToForm(initialState, initialForm, classConstructor, []);
                setForm(nextForm);
                return nextForm;
            });
        },
        setFormErrors(errors) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const touchedValues = Object.keys(form).reduce((stack, key) => (Object.assign(Object.assign({}, stack), { [key]: Object.assign(Object.assign({}, form[key]), { touched: true }) })), {});
                const values = yield mapStateToForm(state, touchedValues, classConstructor, errors);
                setForm(values);
                return values;
            });
        },
        setFormState: (nextState) => setState(Object.assign(Object.assign({}, state), nextState)),
        setFormFocus: (key) => setForm(Object.assign(Object.assign({}, form), { [key]: Object.assign(Object.assign({}, form[key]), { focus: true }) })),
        setFormBlur: (key) => setForm(Object.assign(Object.assign({}, form), { [key]: Object.assign(Object.assign({}, form[key]), { focus: false, touched: true }) })),
    };
}
exports.useForm = useForm;
//# sourceMappingURL=use-form.js.map