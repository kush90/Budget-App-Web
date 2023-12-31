import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddExpenseForm from '../components/AddExpenseForm';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';

import AddBudgetForm from '../components/AddBudgetForm';
import BudgetItem from '../components/BudgetItem';
import { DataProvider } from '../context';
import { setNetworkHeader, generateRandomColor, API_URL } from '../helper';


const Home = () => {
  const [budgets, setBudgets] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [errorControl, setErrorControl] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await axios.get(`${API_URL}/api/budget/getAll`, setNetworkHeader());
        if (response.status === 200) {
          setBudgets(response.data.data);
          setLoading(false)
        }
      }
      catch (error) {
        setLoading(false)
      }
    }
    fetchData();

  }, [message]);

  const handleCreateUpdate = async (data) => {
    setLoading(true);
    if (data.id) {
      try {
        const response = await axios.patch(`${API_URL}/api/budget/update/${data.id}`, data, setNetworkHeader());
        setMessage({ msg: response.data.message, status: 'success' });
        setErrorControl(true);
        const newArr = budgets.map(obj =>
          obj._id === data.id ? { ...obj, name: data.name, amount: data.amount } : obj
        );
        setBudgets(newArr);
        setLoading(false);
      } catch (error) {
        setMessage({ msg: error.response.data.error, status: 'error' });
        setErrorControl(true);
        setLoading(false);
      }

    }
    else {
      try {
        let color;
        if (budgets) { color = generateRandomColor(budgets.length) };
        data['color'] = color;
        const response = await axios.post(`${API_URL}/api/budget/create`, data, setNetworkHeader());
        let newArr = budgets;
        newArr.unshift({ ...response.data.data, "expenses": [] });
        setBudgets(newArr);
        setMessage({ msg: response.data.message, status: 'success' });
        setErrorControl(true);
        setLoading(false)
      } catch (error) {
        if (error.response.status === 400) {
          setMessage({ msg: error.response.data.error, status: 'error' });
          setErrorControl(true);
          setLoading(false)
        }
      }
    }
  }

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setErrorControl(false);
  };

  const handleCreateUpdateExpenseClick = async (data) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/api/expense/create`, data, setNetworkHeader());
      setMessage({ msg: response.data.message, status: 'success' });
      budgets.map((budget) => {
        if (budget._id === data.budgetId) {
          return budget.expenses.push(response.data.data)
        }
        return budget
      })
      setErrorControl(true);
      setLoading(false)
    }
    catch (error) {
      console.error(error);

      if (error.response.status === 400) {
        setMessage({ msg: error.response.data.error, status: 'error' });
        setErrorControl(true);
        setLoading(false)
      }
    }

  }

  const deleteBudget = async (id) => {
    setLoading(true)
    try {
      const response = await axios.delete(`${API_URL}/api/budget/delete/${id}`, setNetworkHeader());
      setMessage({ msg: response.data.message, status: 'success' });
      setBudgets(budgets.filter((obj) => { return obj._id !== id }))
      setErrorControl(true);
      setLoading(false)
    } catch (error) {
      setMessage({ msg: error.response.data.error, status: 'error' });
      setErrorControl(true);
      setLoading(false)
    }
  }

  const searchName = async (event) => {
    setLoading(true)
    const response = await axios.get(`${API_URL}/api/budget/getAll?search=${event.target.value}`, setNetworkHeader());
    setBudgets(response.data.data);
    setLoading(false)


  }

  return (
    <DataProvider>
      {loading ?? <LinearProgress />}
      <h2 style={{ "marginLeft": "22px" }}>Dashboard</h2>
      <Grid className='home-card' container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item lg={6} xs={12} md={6} sm={12}>
          <AddBudgetForm handleCreateUpdate={handleCreateUpdate} />
        </Grid>
        <Grid item lg={6} xs={12} md={6} sm={12}>
          <AddExpenseForm budgets={budgets} handleCreateUpdateClick={handleCreateUpdateExpenseClick} />
        </Grid>

      </Grid>
      <h2 style={{ "marginLeft": "22px" }}>Budgets ({budgets.length})</h2>
      <TextField style={{ marginLeft: 22 }} onKeyUp={searchName} width={210} id="standard-basic" placeholder='Enter name to search ...' focused={true} label="Name" variant="standard" />
      <Grid className='home-card' container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

        {budgets.map((budget) => {
          return (

            <Grid key={budget._id} item xs={12} md={4} sm={12} >
              <BudgetItem key={budget._id} budget={budget} deleteBudgetClick={deleteBudget} />
            </Grid>
          )
        })}

        <Snackbar onClose={handleClose} autoHideDuration={3000}
          open={errorControl} >
          <Alert onClose={handleClose} severity={message.status} sx={{ width: '100%' }}>
            {message.msg}
          </Alert>
        </Snackbar>
      </Grid>
    </DataProvider>

  )
}

export default Home