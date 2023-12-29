import React, { useEffect, useState, } from 'react'
import Grid from '@mui/material/Grid';
import axios from "axios";
import { useParams } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

import { setNetworkHeader,capitalize, API_URL } from '../helper';
import AddExpenseForm from '../components/AddExpenseForm';
import { useDataContext } from '../context';
import BudgetItem from '../components/BudgetItem';
import ClientSideTable from '../components/ClientSideTable';



export default function BudgetDetail() {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [errorControl, setErrorControl] = React.useState(false);
  const params = useParams();
  const [budget, setBudget] = useState('');
  const [budgets, setBudgets] = useState([]);
  const { sharedData } = useDataContext();

  async function fetchData() {
    if (params.id) {
      try {
        const response = await axios.get(`${API_URL}/api/budget/get/${params.id}`, setNetworkHeader());
        setBudget(response.data.data);
      }
      catch (error) {
      }
    }

  }

  useEffect(() => {
    async function fetchBudgetsData() {
      try {
        const response = await axios.get(`${API_URL}/api/budget/getAll`, setNetworkHeader());
        if (response.status === 200) {
          setBudgets(response.data.data);
        }
      }
      catch (error) { }
    }
    fetchData();
    fetchBudgetsData();
  }, []);

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setErrorControl(false);
  };
  const handleCreateUpdateExpenseClick = async (data) => {
    if (sharedData && sharedData.type === 'expense') {
      try {
        const response = await axios.patch(`${API_URL}/api/expense/update/${sharedData.data._id}`, data, setNetworkHeader());
        setMessage({ msg: response.data.message, status: 'success' });
        let newData = budget;
        let arr = newData.expenses;
        const newArr = arr.map((obj) => 
          obj._id === sharedData.data._id ? { ...obj, name: data.name, amount: +data.amount } : obj
        );
        newData.expenses = newArr;
        setBudget(newData)
        setErrorControl(true);
      } catch (error) {
        setMessage({ msg: error.response.data.error, status: 'error' });
        setErrorControl(true);
      }

    }
    else {
      try {
        data.budgetId = budget._id;
        const response = await axios.post(`${API_URL}/api/expense/create`, data, setNetworkHeader());
        setMessage({ msg: response.data.message, status: 'success' });
        let newData = budget;
        let arr = newData.expenses;
        arr.push(response.data.data);
        newData.expenses = arr;
        setBudget(newData);
        setErrorControl(true);
      } catch (error) {
        setMessage({ msg: error.response.data.error, status: 'error' });
        setErrorControl(true);
      }
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/expense/delete/${id}`, setNetworkHeader());
      setMessage({ msg: response.data.message, status: 'success' });
      let data = budget;
      let arr = data.expenses;
      let newArr = arr.filter((obj) => obj._id !== id);
      data.expenses = newArr;
      setBudget(data);
      setErrorControl(true);
    } catch (error) {
      setMessage({ msg: error.response.data.error, status: 'error' });
      setErrorControl(true);
    }
  }

  const budgetDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/budget/delete/${id}`, setNetworkHeader());
      setMessage({ msg: response.data.message, status: 'success' });
      setBudget('');
      navigate('/home')
      setErrorControl(true);
    } catch (error) {
      setMessage({ msg: error.response.data.error, status: 'error' });
      setErrorControl(true);
    }
  }
  return (

    <>
    <h2 style={{
       "marginLeft": "22px"
    }}>Your Budget <span  style={{
      "color": `hsl(${budget.color})`
    }}>({capitalize(budget.name)})</span> Detail</h2>
      <Grid className='home-card' container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid item xs={12}  md={12} sm={12} lg={6}>
          <BudgetItem budget={budget} deleteBudgetClick={budgetDelete} />
        </Grid>
        <Grid item xs={12}   md={12} sm={12} lg={6}>
          <AddExpenseForm budgets={budgets} handleCreateUpdateClick={handleCreateUpdateExpenseClick}></AddExpenseForm>
        </Grid>

      </Grid>
      <h2 style={{"marginLeft":"22px"}}>Expenses ({budget?.expenses?.length})</h2>
      <Grid className='home-card' container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
        <Grid item xs={12}>
          <ClientSideTable data={budget.expenses} handleDelete={handleDelete} showBudget={false}></ClientSideTable>
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
