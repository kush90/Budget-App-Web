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
import Button from '@mui/material/Button';
import DatePicker from "react-datepicker";
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

import { setNetworkHeader, months, API_URL, checkStorage } from '../helper';
import Table from '../components/Table';

import "react-datepicker/dist/react-datepicker.css";


const Profile = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState('');
  const [paginate, setPaginate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = React.useState('');
  const [errorControl, setErrorControl] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Filter by month
  const handleChangeMonth = async (event) => {
    try {
      setLoading(true)
      setMonth(event.target.value);
      const response = await axios.get(`${API_URL}/api/expense/getAll?month=${event.target.value}`, setNetworkHeader());
      const response1 = await axios.get(`${API_URL}/api/budget/chartData?month=${event.target.value}`, setNetworkHeader());
      setChartData(response1.data.data);
      setBudgets(response.data.data);
      setPaginate(response.data.paginate);
      setSelectedDate('');
      setLoading(false)
    }

    catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage({ msg: error.response.data.error, status: 'error' });
      }
      else {
        setMessage({ msg: error.message, status: 'error' })
      }
      setErrorControl(true);
      setLoading(false);
    }
  }

  // Get all budgets data for chart and all expeneses data for table
  async function fetchData() {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/budget/chartData`, setNetworkHeader());
      const response1 = await axios.get(`${API_URL}/api/expense/getAll`, setNetworkHeader())
      setChartData(response.data.data);
      setBudgets(response1.data.data);
      setPaginate(response1.data.paginate);
      setLoading(false)
    }
    catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage({ msg: error.response.data.error, status: 'error' });
      }
      else {
        setMessage({ msg: error.message, status: 'error' })
      }
      setErrorControl(true);
      setLoading(false);
    }
  }
  useEffect(() => {
    if (checkStorage('user') === true){ fetchData()}
    else {
      navigate('/');
    }
  }, []);

  // Search by expense name
  const searchName = async (event) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/expense/getAll?search=${event.target.value}`, setNetworkHeader());
      setBudgets(response.data.data)
      setPaginate(response.data.paginate);
      setLoading(false)
    }
    catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage({ msg: error.response.data.error, status: 'error' });
      }
      else {
        setMessage({ msg: error.message, status: 'error' })
      }
      setErrorControl(true);
      setLoading(false);
    }

  }

  // Get data when the next button from table is clicked
  const tableNextBtn = async (page) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/expense/getAll?page=${page}`, setNetworkHeader());
      setBudgets(response.data.data)
      setPaginate(response.data.paginate);
      setLoading(false)
    }
    catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage({ msg: error.response.data.error, status: 'error' });
      }
      else {
        setMessage({ msg: error.message, status: 'error' })
      }
      setErrorControl(true);
      setLoading(false);
    }

  }

  // Get data when the select option of total per page from table is clicked
  const tablePerPage = async (rows, page) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/expense/getAll?page=${page}&&rows=${rows}`, setNetworkHeader());
      setBudgets(response.data.data)
      setPaginate(response.data.paginate);
      setLoading(false)
    }
    catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage({ msg: error.response.data.error, status: 'error' });
      }
      else {
        setMessage({ msg: error.message, status: 'error' })
      }
      setErrorControl(true);
      setLoading(false);
    }

  }

  // Get data from selected date from date picker
  const changeDate = async (date) => {
    try {
      setLoading(true)
      setSelectedDate(date);
      const response = await axios.get(`${API_URL}/api/expense/getAll?selectedDate=${date}`, setNetworkHeader());
      setBudgets(response.data.data)
      const response1 = await axios.get(`${API_URL}/api/budget/chartData?selectedDate=${date}`, setNetworkHeader());
      setChartData(response1.data.data);
      setPaginate(response.data.paginate)
      setMonth('');
      setLoading(false)
    }
    catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage({ msg: error.response.data.error, status: 'error' });
      }
      else {
        setMessage({ msg: error.message, status: 'error' })
      }
      setErrorControl(true);
      setLoading(false);
    }


  }

  const clearFilter = () => {
    fetchData();
    setSelectedDate('');
    setMonth('')
  }
  // close error message
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setErrorControl(false);
  };
  return (

    <>
      {loading ? <LinearProgress /> : ''}
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid item lg={4} xs={12} md={3} sm={12}>
          <h1>Your expenses report</h1>
        </Grid>
        <Grid item lg={2} xs={12} md={3} sm={12} className='filter-div'>
          <Box>
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
        <Grid item lg={3} xs={12} md={3} sm={12}>
          <Box className="date-picker-box">
            <p style={{ marginLeft: 4 }}>Select Date</p>
            <DatePicker
              showIcon
              selected={selectedDate}
              onChange={changeDate}
            />

          </Box>
        </Grid>
        <Grid item lg={2} xs={12} md={3} sm={12}>
          <Box >
            <Button onClick={clearFilter} className="clear-btn" size='small' variant="outlined">Clear Filter</Button>
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
          <Table data={budgets} showBudget={true} showAction={false} tableNextBtn={tableNextBtn} tablePerPage={tablePerPage} paginate={paginate} ></Table>
        </Grid>
      </Grid>
      <Snackbar onClose={handleClose} autoHideDuration={3000}
        open={errorControl} >
        <Alert onClose={handleClose} severity={message.status} sx={{ width: '100%' }}>
          {message.msg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Profile