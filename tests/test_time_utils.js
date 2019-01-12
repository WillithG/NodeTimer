const PATH_TO_TIME_UTILS = '../utils/time_util.js';
var assert = require('assert');
var time_utils = require(PATH_TO_TIME_UTILS);

describe('converting_input_time_seconds test',function() {
    // no need to test user input, because input should be validated before being passed to this method.
    it('0 test', function() {
        var zero_input = '00 : 00 . 000';
        var zero_test = time_utils.convert_input_time_seconds(zero_input);
        assert.equal(zero_test, 0);
    });

    // test both patterns of the most common entry type
    it('normal test, both patterns', function() {
        var normal_wo_hours = '10 : 05 . 134';
        var normal_w_hours = '01 : 03 : 01';
        assert.equal(time_utils.convert_input_time_seconds(normal_wo_hours), 605);
        assert.equal(time_utils.convert_input_time_seconds(normal_w_hours), 3781);
    });
});

describe('total_today_JSON_to_formatted test', function() {
    it('zero test', function() {
        var zero_input = [];
        assert.equal(time_utils.total_today_JSON_to_formatted(zero_input), 'Fuk all..');
    });

    it('normal test, low time', function() {
        var low_single = [
            {timeofperiod : 5}
        ];
        var low_multi = [
            {timeofperiod : 5},
            {timeofperiod : 10},
            {timeofperiod : 5}
        ];
        assert.equal(time_utils.total_today_JSON_to_formatted(low_single), '5 seconds');

        assert.equal(time_utils.total_today_JSON_to_formatted(low_multi), '20 seconds');
    });

    it('normal test, minute time', function() {});

    it('normal test, hour time', function() {
        var high_flat_single = [
            {timeofperiod: 3600}
        ];
        var high_flat_multi = [
            {timeofperiod : 3600},
            {timeofperiod : 3600},
            {timeofperiod : 3600}
        ];

        var high_skethy_single = [
            {timeofperiod : 3665}
        ];
        var high_skethy_multi = [
            {timeofperiod: 3630},
            {timeofperiod : 3630},
            {timeofperiod : 3605}
        ]

        assert.equal(time_utils.total_today_JSON_to_formatted(high_flat_single), '1 hours');
        assert.equal(time_utils.total_today_JSON_to_formatted(high_flat_multi), '3 hours');

        assert.equal(time_utils.total_today_JSON_to_formatted(high_skethy_single), '1 hours, 1 minutes');
        assert.equal(time_utils.total_today_JSON_to_formatted(high_skethy_multi), '3 hours, 1 minutes');

    })
});