import test from "ava";
import {iso8601, secondsMs} from "./index";
import {time} from "@softwareventures/time";

test("secondsMs", t => {
    t.is(secondsMs({seconds: 0.001}), "00.001");
    t.is(secondsMs({seconds: 1}), "01.000");
    t.is(secondsMs({seconds: 1.0012}), "01.001");
    t.is(secondsMs({seconds: 1.0018}), "01.001");
    t.is(secondsMs({seconds: 22.0018}), "22.001");
});

test("iso8601", t => {
    t.is(iso8601()(time({hours: 11, minutes: 58, seconds: 27.63981})), "T11:58:27.639809999993304");
    t.is(
        iso8601({round: "seconds"})(time({hours: 11, minutes: 58, seconds: 27.63981})),
        "T11:58:27"
    );
    t.is(
        iso8601({round: "ms"})(time({hours: 11, minutes: 58, seconds: 27.63981})),
        "T11:58:27.639"
    );
    t.is(
        iso8601({format: "basic"})(time({hours: 11, minutes: 58, seconds: 27.63981})),
        "T115827.639809999993304"
    );
    t.is(
        iso8601({leadingT: false})(time({hours: 11, minutes: 58, seconds: 27.63981})),
        "11:58:27.639809999993304"
    );
    t.is(iso8601()(time({})), "T00:00:00");
    t.is(iso8601()(time({hours: 13, minutes: 5, seconds: 30})), "T13:05:30");
});
