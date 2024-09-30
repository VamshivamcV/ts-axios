import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import CryptoSummary from "./components/CryptoSummary";
import { Crypto } from "./Types";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import moment from "moment";

ChartJS.register(
  ArcElement,
  // CategoryScale,
  // LinearScale,
  // PointElement,
  // LineElement,
  // Title,
  Tooltip,
  Legend,
);
// at 60 15:00 
function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto[]>([]);

  const [range, setRange] = useState<number>(30);

  const [data, setData] = useState<ChartData<"pie">>();

  // const [data, setData] = useState<ChartData<"line">>();
  // const [options, setOptions] = useState<ChartOptions<"line">>({
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //     title: {
  //       display: true,
  //       text: "Chart.js Line Chart",
  //     },
  //   },
  // });

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=false";
    axios.get(url).then((response) => {
      console.log(response.data);
      setCryptos(response.data);
    });
  }, []);

  // useEffect(() => {
  //   if(!selected) return;
  //   axios
  //     .get(
  //       `https://api.coingecko.com/api/v3/coins/${selected?.id}/market_chart?vs_currency=usd&days=${range}&${range === 1 ? `interval=hourly` : `interval=daily`}`
  //     )
  //     .then((response) => {
  //       console.log(response.data);
  //       setData({
  //         labels: response.data.prices.map((price: number[]) => {
  //           return moment.unix(price[0] / 1000).format(range === 1 ? " HH:MM" : "MM-DD");
  //         }),
  //         datasets: [
  //           {
  //             label: "Dataset 1",
  //             data: response.data.prices.map((price: number[]) => {
  //               return price[1];
  //             }),
  //             borderColor: "rgb(255, 99, 132)",
  //             backgroundColor: "rgba(255, 99, 132, 0.5)",
  //           },
  //         ],
  //       });
  //       setOptions({
  //         responsive: true,
  //         plugins: {
  //           legend: {
  //             display: false,
  //           },
  //           title: {
  //             display: true,
  //             text: `${selected?.name} price Over last `+ range + (range ===1 ? " Day." : " Days."),
  //           },
  //         }
  //       })
  //     });
  // }, [selected, range]);

  useEffect(() => {
    console.log('SELECTED: ', selected);
    if(selected.length === 0) return
    setData({
      labels: selected.map((s) => s.name),
      datasets: [
        {
          label: '# of votes',
          data: selected.map((s) => s.owned * s.current_price),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(55, 106, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 155, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(25, 192, 192, 0.2)',
            'rgba(153, 12, 155, 0.2)',
            'rgba(65, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(55, 106, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 155, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(25, 192, 192, 1)',
            'rgba(153, 12, 155, 1)',
            'rgba(65, 159, 64, 1)',
          ],
          borderWidth: 1,
        }
      ]
    })
  }, [selected])

  function updateOwned(crypto: Crypto, amount: number): void{
    console.log('updateOwned', crypto, amount)
    let temp =[...selected];
    let tempObj = temp.find((c) => c.id === crypto.id);
    if (tempObj){
      tempObj.owned = amount;
      setSelected(temp);
    }
  }

  return (
    <>
      <div className="App">
        <select
          defaultValue="default"
          onChange={(e) => {
            const c = cryptos?.find((x) => x.id === e.target.value) as Crypto;
            setSelected([...selected, c]);
          }}
        >
          {cryptos
            ? cryptos.map((crypto) => {
              return (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name}
                </option>
              );
            })
            : null}
          <option value="default">select the option</option>
        </select>

        {/* <select onChange={(e) => {
          setRange(parseInt(e.target.value));
        }}>
          <option value={30}>30 Days</option>
          <option value={7}>7 Days</option>
          <option value={1}>1 Day</option>
        </select> */}


      </div>
      {selected.map((s)=>{return <CryptoSummary crypto={s} updateOwned={updateOwned}/>}) }

      {/* {selected ? <CryptoSummary crypto={selected} /> : null} */}
      {/* {data ? (
        <div style={{ width: 600 }}>
          <Line options={options} data={data} />
        </div>
      ) : null} */}
      {data ? (
        <div style={{ width: 600 }}>
          <Pie data={data} />
        </div>
      ) : null}

      {selected
          ? "Your portfolio is worth: $" + selected.map((s) => {
            if(isNaN(s.owned)){
              return 0;
            }
            return s.current_price * s.owned;
          }).reduce((prev, current) => {
            console.log('prev,current', prev,current);
            return prev + current;
          }, 0)
          .toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) 
          
          : null
      }
    </>
  );
}

export default App;
