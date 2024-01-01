const calendarElement = document.getElementById("calendar");

const numbers = ["no", "pa", "re", "ci", "vo", "mu", "xa", "ze", "bi", "so", "dau", "fei", "gai", "jau", "rei", "vai"];
const weekDays = 7;
const monthSize = 14;
const monthDays = 28;
const weeksName = "djed.";
const monthsName = "mast.";
const numbersBase = 12;

const date = new Date();
const year = date.getFullYear();
const dayStart = new Date(year, 0, 1).getDay();
const leapYear = new Date(year, 2, 0).getDate() === 29? 1: 0;
const dayCounter = [...Array(date.getMonth()).keys()]
  .map(i => new Date(year, (i+1), 0).getDate())
  .reduce((monthSum, monthDays) => monthSum+monthDays, new Date().getDate()-1);

const renderedWeekNames = [...Array(weekDays).keys()]
  .map(weekId => {
    const index = (weekId+dayStart)%weekDays;
    const weekName = numbers[index]+weeksName
    const firstDayClass = (index === 1)? " first-day" : "";
    return `<li class="day-name${firstDayClass}">${weekName}</li>`
  })
  .join("");

const monthsData = [...Array(monthSize).keys()]
  .map(monthId => {
    const isLast = (monthId === monthSize-1);
    const days = isLast? 1+leapYear: monthDays;
    const name = isLast? numbers[0]: numbers[monthId+1];
    return {monthName: name+monthsName, daysOfMonth: days};
  });

const html = monthsData.map(({monthName, daysOfMonth}) => {
  const days = [...Array(daysOfMonth).keys()];

  const renderedDays = days
    .map((day) => {
      const index = (day+dayStart)%weekDays;
      const firstDayClass = (index === 1)? " first-day" : "";
      return `<li class="day${firstDayClass}">${(day+1).toString(numbersBase)}</li>`
    })
    .join("");

  const title = `<h2>${monthName}</h2>`;

  return `<div class="month">${title}<ol>${renderedWeekNames} ${renderedDays}</ol></div>`
}).join("")

calendarElement.innerHTML = html
document.getElementsByClassName("day")[dayCounter].classList.add("today")

const clockElement = document.getElementById("clock");

const timeSeparator = { milli: 1000, s: 60, m: 60, h: 24 };
const timeConverter = { milli: 1728, s: 72, m: 72, h: 24 };

const zeros = (text, n_zeros) => {
  if (text.length === n_zeros)
    return text;
  return '0'.repeat(n_zeros - text.length) + text;
}

const calcTime = () => {
  const actualDate = new Date();
  const actualTime =
    //hours
    actualDate.getHours() * timeSeparator.milli * timeSeparator.s * timeSeparator.m +
    //minutes
    actualDate.getMinutes() * timeSeparator.milli * timeSeparator.s +
    //seconds
    actualDate.getSeconds() * timeSeparator.milli +
    //miliseconds
    actualDate.getMilliseconds();
  const timeInSeconds = actualTime * timeConverter.milli * timeConverter.s * timeConverter.m * timeConverter.h / (timeSeparator.milli * timeSeparator.s * timeSeparator.m * timeSeparator.h);

  const hours = Math.floor(timeInSeconds / (timeConverter.milli * timeConverter.s * timeConverter.m));
  const minutes = Math.floor((timeInSeconds / (timeConverter.milli * timeConverter.s * timeConverter.m) - hours) * timeConverter.m);
  const seconds = Math.floor(((timeInSeconds / (timeConverter.milli * timeConverter.s * timeConverter.m) - hours) * timeConverter.m - minutes) * timeConverter.s);
  //const milliseconds = Math.floor((((timeInSeconds / (timeConverter.milli * timeConverter.s * timeConverter.m) - hours) * timeConverter.m - minutes) * timeConverter.s - seconds) * timeConverter.milli);
  
  const time = `${zeros((hours).toString(numbersBase), 2)}:${zeros((minutes).toString(numbersBase), 2)}:${zeros((seconds).toString(numbersBase), 2)}`;
  
  //const time = `${zeros((hours).toString(numbersBase), 2)}:${zeros((minutes).toString(numbersBase), 2)}:${zeros((seconds).toString(numbersBase), 2)}.${zeros((milliseconds).toString(numbersBase), 3)}`;
  clockElement.innerHTML = time;
}

setInterval(calcTime, 700);
