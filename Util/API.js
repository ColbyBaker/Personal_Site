import _regeneratorRuntime from "babel-runtime/regenerator";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import { request } from "https://cdn.skypack.dev/@octokit/request";
var githubAPI = {
    owner: "ColbyBaker",
    //apiKey: process.env.REACT_APP_GITHUB_TOKEN,
    userURL: "https://api.github.com/repos/ColbyBaker/",
    personalSiteDescription: "",

    getRepo: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(repoName) {
            var response;
            return _regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return request("GET /repos/" + this.owner + "/" + repoName, {
                                // headers: {
                                //     authorization: this.apiKey,
                                // }
                            });

                        case 2:
                            response = _context.sent;
                            return _context.abrupt("return", response);

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getRepo(_x) {
            return _ref.apply(this, arguments);
        }

        return getRepo;
    }()
};

export { githubAPI };