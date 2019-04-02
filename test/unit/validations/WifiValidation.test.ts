import { validate } from "class-validator";
import { Wifi } from "../../../src/api/models/Wifi";

describe("WifiValidation", () => {
    test("Wifi should always have a name and a ssid", async done => {
        const wifi = new Wifi();
        const errorsNoNameNoSSID = await validate(wifi);
        expect(errorsNoNameNoSSID.length).toEqual(2);
        wifi.name = "Test";
        const errorNoSSID = await validate(wifi);
        expect(errorNoSSID.length).toEqual(1);
        wifi.ssid = "ssid";
        const noErrors = await validate(wifi);
        expect(noErrors.length).toEqual(0);
        done();
    });
});
