PLOT_AREA = document.getElementById('plotarea');

const a = 0.03134;
const b = 1.55 * Math.pow(10,-10);
const p0 = 3929214;

const logistic = (t) => (a*p0) / (b*p0 + (a-b*p0) * Math.exp(-a*t));

const x = Array.from({length: 161}, (x,i) => i);
y = x.map(logistic);

Plotly.plot(PLOT_AREA, [{x:x.map(xi => xi + 1790),y:y}],{margin:{t:0}});