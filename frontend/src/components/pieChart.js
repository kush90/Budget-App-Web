import React, { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import {
    formatCurrency,
    capitalize
} from "../helper";

const PieChartComponent = ({ data }) => {
    const [newData, setNewData] = useState([]);
    useEffect(() => {

        if (data.length > 0) setNewData(data)
        else setNewData([]);
    }, [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (payload.length > 0) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#ffff",
                        padding: "5px",
                        border: "1px solid #cccc"
                    }}
                >
                    <label>{`${capitalize(payload[0].name)} : ${formatCurrency(payload[0].value)}`}</label>
                </div>
            );
        }
        return null;
    };

    let renderLabel = function ( entry) {
        return `${formatCurrency(entry.value)}`
    }

    return (
        <>

            {
                data.length > 0 ? (
                    <div className="chart-style">
                        <ResponsiveContainer width="100%" height={372} className="text-center">
                            <PieChart >
                                <Legend layout="horizontal" verticalAlign="top" align="top" />
                                <Pie
                                 width="100%" height={372}
                                    data={newData}
                                    isAnimationActive={true}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                     cy="50%"
                                    labelLine={true}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label={renderLabel}
                                    
                                >
                                    <LabelList
                                        dataKey="name"
                                        position="insideRight"
                                        fill="#8884d8"
                                        style={{ fontSize: "13px" }}
                                    />
                                    {newData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(${entry.color})`} />
                                    ))}

                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p style={{ "color": "red" }}>No data to be shown in pie chart!</p>
                )
            }



        </>
    )
}
export default PieChartComponent;