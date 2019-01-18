"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const Validated_1 = require("./Validated");
const check_1 = require("./check");
const generatePlanets_1 = require("./generatePlanets");
exports.checkLambda = (event, _context, callback) => {
    if (event.body === null) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify(["No body"])
        });
    }
    else {
        let json;
        try {
            json = JSON.parse(event.body);
            const validatedTransactions = parser_1.parse(json);
            if (validatedTransactions.type === Validated_1.ERROR) {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(validatedTransactions.errors)
                });
            }
            else {
                const planets = generatePlanets_1.generatePlanets(4, 100);
                const checkResult = check_1.check(planets, validatedTransactions.value);
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(checkResult.errors)
                });
            }
        }
        catch (_a) {
            callback(null, {
                statusCode: 400,
                body: JSON.stringify(["No JSON"])
            });
        }
    }
};
