import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

import BudgetItem from '../components/BudgetItem';
import { DataProvider } from '../context';
import { setNetworkHeader, generateRandomColor, API_URL, checkStorage } from '../helper';
import { ModalForm } from '../components/ModalForm';
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [errorControl, setErrorControl] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [openModalForm, setOpenModalForm] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await axios.get(`${API_URL}/api/budget/getAll`, setNetworkHeader());
        if (response.status === 200) {
          setBudgets(response.data.data);
          setLoading(false)
        }
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
    if (checkStorage('user') === true){ fetchData()}
    else {
      navigate('/');
    }

  }, []);

  /*      **** Create & Update Budget   ****       */
  const handleCloseModalForm = (value) => {
    setOpenModalForm(false); // close modal
    if (value) handleCreateUpdate(value); // update data from modal
  };

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

  /*      **** End Of Create & Update Budget   ****       */

  // close error message
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setErrorControl(false);
  };

  /*      **** Create & Update Expense   ****       */
  const handleCreateUpdateExpenseClick = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/expense/create`, data, setNetworkHeader());
      setMessage({ msg: response.data.message, status: 'success' });
      const updatedDataArray = [...budgets];
      const updatedParentIndex = updatedDataArray.findIndex(item => item._id === data.budgetId);
      if (updatedParentIndex !== -1) {
        const updatedChildArray = [...updatedDataArray[updatedParentIndex].expenses, response.data.data];
        updatedDataArray[updatedParentIndex] = {
          ...updatedDataArray[updatedParentIndex],
          expenses: updatedChildArray,
        };
        setBudgets(updatedDataArray)
        setErrorControl(true);
        setLoading(false)
      }
    }
    catch (error) {
      console.error(error);
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

  // Delete Budget
  const deleteBudget = async (id) => {
    setLoading(true)
    try {
      const response = await axios.delete(`${API_URL}/api/budget/delete/${id}`, setNetworkHeader());
      setMessage({ msg: response.data.message, status: 'success' });
      setBudgets(budgets.filter((obj) => { return obj._id !== id }))
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

  // search by budget name
  const searchName = async (event) => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/budget/getAll?search=${event.target.value}`, setNetworkHeader());
      setBudgets(response.data.data);
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

  return (
    <DataProvider>
      {loading === true ? <LinearProgress /> : ''}
      <h2 style={{ "marginLeft": "22px" }}>Budgets ({budgets.length})
        <Tooltip title="Create Budget">
          <Fab size="small" style={{ marginLeft: 20 }} color="primary" aria-label="add" onClick={() => { setOpenModalForm(true) }}>
            <AddIcon />
          </Fab>
        </Tooltip>
        <TextField style={{ marginLeft: 22 }} onKeyUp={searchName} width={210} id="standard-basic" placeholder='Enter name to search ...' focused={true} label="Name" variant="standard" />
      </h2>
      <Grid className='home-card' container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

        {budgets.map((budget) => {
          return (

            <Grid key={budget._id} item xs={12} md={4} sm={12} >
              <BudgetItem key={budget._id} budget={budget} deleteBudgetClick={deleteBudget} handleCreateUpdate={handleCreateUpdate} handleCreateUpdateExpenseClick={handleCreateUpdateExpenseClick} />
            </Grid>
          )
        })}

        <Snackbar onClose={handleClose} autoHideDuration={3000}
          open={errorControl} >
          <Alert onClose={handleClose} severity={message.status} sx={{ width: '100%' }}>
            {message.msg}
          </Alert>
        </Snackbar>
        <ModalForm
          open={openModalForm}
          onClose={handleCloseModalForm}
        />
      </Grid>
    </DataProvider>

  )
}

export default Home