// import { useState, useEffect, useRef } from "react";
// import * as Chart from 'chart.js';
// import useStore from "../store/todoStore";

// export const TodoChart = () => {
//     const chartRef = useRef(null);
//     const chartInstanceRef = useRef(null);
//     const { todos } = useStore();

//     const completed = todos.filter((todo) => todo.completed).length;
//     const pending = todos.filter((todo) => !todo.completed).length;

//     useEffect(() => {
//         // Register Chart.js components
//         Chart.Chart.register(
//             Chart.ArcElement,
//             Chart.Tooltip,
//             Chart.Legend,
//             Chart.Title,
//             Chart.CategoryScale,
//             Chart.LinearScale
//         );

//         // Create chart only after component mounts
//         if (chartRef.current) {
//             const ctx = chartRef.current.getContext('2d');
//             chartInstanceRef.current = new Chart.Chart(ctx, {
//                 type: 'pie',
//                 data: {
//                     labels: ['Completed', 'Pending'],
//                     datasets: [{
//                         data: [completed, pending],
//                         backgroundColor: ['#28a745', '#dc3545'],
//                         borderColor: ['#1e7e34', '#c82333'],
//                         borderWidth: 2
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                         title: {
//                             display: true,
//                             text: 'Todo Completion Status'
//                         },
//                         legend: {
//                             position: 'bottom',
//                         }
//                     }
//                 }
//             });
//         }

//         // Cleanup function
//         return () => {
//             if (chartInstanceRef.current) {
//                 chartInstanceRef.current.destroy();
//             }
//         };
//     }, [completed, pending]); // Re-run when todo counts change

//     return (
//         <div style={{ width: '400px', height: '400px' }}>
//             <canvas ref={chartRef}></canvas>
//         </div>
//     );
// };

import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import useStore from "../store/todoStore";
import { useAuth } from "../store/auth.store";
// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

export const TodoChart = ({type}) => {
    const { todos } = useStore();
      const { currentUser, loading } = useAuth();
      let labels, var1, var2;
      console.log(todos);
      console.log(type);
    if(type === "completed"){
     labels = ['Completed', 'Pending'];
     var1 = todos.filter((todo) => todo.isCompleted).length;
    var2 = todos.filter((todo) => !todo.isCompleted).length;
    }else{
        labels = ['Personal', 'Outsourced'];
         var1 = todos.filter((todo) => (todo.userId === currentUser.uid && todo.assignedTo.length === 0)).length;
        var2 = todos.filter((todo) => todo.userId !== currentUser.uid).length;
    }
    console.log(var1, var2);
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Todo Completion Status',
                data: [var1, var2],
                backgroundColor: ['#28a745', '#dc3545'],
                borderColor: ['#1e7e34', '#c82333'],
                borderWidth: 2
            }
        ]

    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Todo Completion Status'
            },
            legend: {
                position: 'bottom',
            }
        }
    };

    return <Doughnut data={data} options={options} />
}


