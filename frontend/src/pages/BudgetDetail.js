import React, { useEffect, useState, } from 'react'
import Grid from '@mui/material/Grid';
import axios from "axios";
import { useParams } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

import { setNetworkHeader, capitalize, API_URL } from '../helper';
import { useDataContext } from '../context';
import BudgetItem from '../components/BudgetItem';
import ClientSideTable from '../components/ClientSideTable';
import { ExpenseModalForm } from '../components/ExpenseModalForm';



export default function BudgetDetail() {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [errorControl, setErrorControl] = React.useState(false);
  const params = useParams();
  const [budget, setBudget] = useState('');
  const { sharedData } = useDataContext();
  const [loading, setLoading] = React.useState(false);
  const [openExpenseModalForm, setOpenExpenseForm] = React.useState(false)

  // Get Budget info by id
  async function fetchData() {
    if (params.id) {
      setLoading(true)
      try {
        const response = await axios.get(`${API_URL}/api/budget/get/${params.id}`, setNetworkHeader());
        setBudget(response.data.data);
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

  }

  useEffect(() => {
    fetchData();
  }, [params.id, message]);

  // close error message
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setErrorControl(false);
  };

  /*      **** Create & Update Budget   ****       */
  const handleCreateUpdate = async (data) => {
    if (data.id) {
      try {
        const response = await axios.patch(`${API_URL}/api/budget/update/${data.id}`, data, setNetworkHeader());
        setMessage({ msg: response.data.message, status: 'success' });
        setErrorControl(true);
        setBudget(data);
        setLoading(false);
      } catch (error) {
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
  }

  // Budget Delete
  const budgetDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/budget/delete/${id}`, setNetworkHeader());
      setMessage({ msg: response.data.message, status: 'success' });
      setBudget('');
      navigate('/home')
      setErrorControl(true);
      setLoading(false)
    } catch (error) {
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


  /*      **** Create & Update Expense   ****       */

  // Call Expense Modal
  const callExpenseModalForm = () => {
    setOpenExpenseForm(true)
  }

  //  Update Expense data
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
        setLoading(false)
      } catch (error) {
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
        setLoading(false)
      } catch (error) {
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
  }
  //  Close Expense Modal and update data
  const handleCloseExpenseModalForm = (value) => {
    setOpenExpenseForm(false);
    if (value) handleCreateUpdateExpenseClick(value);
  };

  // Call Expense Modal for update
  const handleEditExpense = () => {
    setOpenExpenseForm(true)
  }

  // Expense delete
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
      setLoading(false)
    } catch (error) {
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

  /*      **** End Of Create & Update Expense   ****       */

  return (

    <>
      { loading === true ? <LinearProgress /> : ''}
      <h2 style={{
        "marginLeft": "22px"
      }}>Your Budget <span style={{
        "color": `hsl(${budget.color})`
      }}>({capitalize(budget.name)})</span> Detail
        <Tooltip title="Add Expense">
          <Fab size="small" style={{ marginLeft: 20 }} color="primary" aria-label="add" onClick={callExpenseModalForm}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </h2>
      <Grid className='home-card' container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid item xs={12} md={12} sm={12} lg={6}>
          <BudgetItem budget={budget} deleteBudgetClick={budgetDelete} handleCreateUpdate={handleCreateUpdate} />
        </Grid>
      </Grid>
      <h2 style={{ "marginLeft": "22px" }}>Expenses ({budget?.expenses?.length})</h2>
      <Grid className='home-card' container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
        <Grid item xs={12}>
          <ClientSideTable data={budget.expenses} handleDelete={handleDelete} showBudget={false} handleEditExpense={handleEditExpense}></ClientSideTable>
        </Grid>

      </Grid>
      <Snackbar onClose={handleClose} autoHideDuration={3000}
        open={errorControl} >
        <Alert onClose={handleClose} severity={message.status} sx={{ width: '100%' }}>
          {message.msg}
        </Alert>
      </Snackbar>
      <ExpenseModalForm
        open={openExpenseModalForm}
        budgetId={budget._id}
        onClose={handleCloseExpenseModalForm}
      />
    </>
  )
}
