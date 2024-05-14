"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithToken = void 0;
const react_1 = require("react");
function WithToken({ token, setToken }) {
    react_1.useEffect(() => {
        const token = localStorage.getItem("token");
        if (token === null || token === "") {
            setToken(undefined);
        }
        else {
            setToken(token);
        }
    }, []);
    react_1.useEffect(() => {
        localStorage.setItem("token", token !== null && token !== void 0 ? token : "");
    }, [token]);
    return null;
}
exports.WithToken = WithToken;
//# sourceMappingURL=with-token.js.map