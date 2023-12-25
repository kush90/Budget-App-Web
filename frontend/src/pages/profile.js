import React, { useEffect, useState } from 'react';
import CustomPieChart from '../components/pieChart';
import axios from "axios";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { setNetworkHeader, months } from '../helper';
import Table from '../components/Table';

const Profile = () => {
  const [chartData, setChartData] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState('');

  const handleChangeMonth = async (event) => {
    setMonth(event.target.value);
    const response = await axios.get(`http://localhost:4000/api/expense/getAll?month=${event.target.value}`, setNetworkHeader());
    const response1 = await axios.get(`http://localhost:4000/api/budget/chartData?month=${event.target.value}`, setNetworkHeader());
    setChartData(response1.data.data)
    setBudgets(response.data.data)
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:4000/api/budget/chartData`, setNetworkHeader());
        const response1 = await axios.get(`http://localhost:4000/api/expense/getAll`, setNetworkHeader())
        setChartData(response.data.data);
        setBudgets(response1.data.data);
      }
      catch (error) {
      }
    }

    fetchData();
  }, []);

  const searchName = async (event) => {
    const response = await axios.get(`http://localhost:4000/api/expense/getAll?search=${event.target.value}`, setNetworkHeader());
    setBudgets(response.data.data)
  }
  return (

    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid item lg={3} xs={12} md={6} sm={12}>
          <h1>Your expenses report</h1>
        </Grid>
        <Grid item lg={9} xs={12} md={6} sm={12}>
          <Box sx={{ width: 90 }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={month}
                onChange={handleChangeMonth}
                label="Month"
              >
                <MenuItem value="default" disabled>
                  <span style={{ color: "darkgray" }}>Months...</span>
                </MenuItem>
                {
                  months.map((month, index) => {
                    return <MenuItem key={index} value={index = index + 1}>{month}</MenuItem>
                  })
                }
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>


      <hr />

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid item lg={6} xs={12} md={6} sm={12}>
          <CustomPieChart data={chartData} />
        </Grid>
        <Grid item lg={6} xs={12} md={6} sm={12} style={{ "marginTop": "5px", "width": "" }}>
          <TextField style={{ marginBottom: 15 }} width={210} onKeyUp={searchName} id="standard-basic" placeholder='Enter name to search ...' focused={true} label="Name" variant="standard" />
          <Table data={budgets} showBudget={true} showAction={false} ></Table>
        </Grid>
      </Grid>
    </>
  )
}

export default Profile