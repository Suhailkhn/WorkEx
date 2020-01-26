exports.jobDuration = function(startDate, endDate) {
    if(endDate == null)
        endDate = new Date();
    let totalMonths = 0;
    const noOfFullYears = endDate.getFullYear() - startDate.getFullYear() - 1;
    if (noOfFullYears > 0) {
        totalMonths = noOfFullYears * 12;
    }
    if (noOfFullYears >= 0) {
        totalMonths += 12 - startDate.getMonth() + 1;
        totalMonths += endDate.getMonth();
    }
    else {
        totalMonths = endDate.getMonth() - startDate.getMonth() + 1;
    }
    let noOfYears = Math.floor(totalMonths / 12);
    let noOfMonths = totalMonths % 12;
    let duration = "";
    if (noOfYears > 0)
        duration += noOfYears == 1 ? "1yr " : (noOfYears + "yrs ");
    if (noOfMonths > 0)
        duration += noOfMonths == 1 ? "1mo" : (noOfMonths + "mos");
    return duration;
}

exports.getMonthName = function(date) {
    return date.toDateString().substring(4, 7);
}

exports.jobTenure = function(startDate, endDate, isCurrentJob) {
    const tenureStart = exports.getMonthName(startDate) + ". " + startDate.getFullYear();
    const tenureEnd = isCurrentJob == true ? "Present" : (exports.getMonthName(endDate) + ". " + endDate.getFullYear());
    return tenureStart + " - " + tenureEnd;
}

exports.locationDisplay = function(city, countryCode, userAgentString) {
    const maxCharactersToDisplay = exports.increaseLocationDisplayLength(userAgentString) ? 18 : 11;
    const fullLocation = city + ", " + countryCode;
    if (fullLocation.length <= maxCharactersToDisplay)
        return fullLocation;
    else
        return city;
}

exports.increaseLocationDisplayLength = function(userAgentString) {
    const regex = new RegExp('Linux|Mac|Windows|Chromebook|iPad');
    return regex.test(userAgentString);
}