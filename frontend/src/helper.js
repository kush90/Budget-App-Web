import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

// export const API_URL ="https://budget-app-api-pgfu.onrender.com";
export const API_URL = "http://localhost:4000"

export const createStorage = (key, item) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(item));
}

export const getStorage = (key) => {
    return localStorage.getItem(key);
}

export const clearStorage = (key) =>{
    localStorage.clear();
}

// capitalize to first letter
export const capitalize = (str) => {
    if(str)return str.charAt(0).toUpperCase() + str.slice(1);
}

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  // set token to request header
  export const setNetworkHeader = ()=>{
    let user = JSON.parse(getStorage('user'));
    return { headers: { "Authorization": `Bearer ${user.token}`, 'Content-Type': 'application/json' } }
  }

  export const generateRandomColor = (total) => {
    const existingBudgetLength = total ?? 0;
    return `${existingBudgetLength * 34} 65% 50%`;
  };

  // total spent by budget
export const calculateSpentByBudget = (expenses,budgetId) => {
  const budgetSpent = expenses.reduce((acc, expense) => {
    // check if expense.id === budgetId I passed in
    if (expense.budgetId !== budgetId) return acc;

    // add the current amount to my total
    return (acc += expense.amount);
  }, 0);
  return budgetSpent;
};

// FORMATTING
export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

// Formating percentages
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// Format currency
export const formatCurrency = (amt) => {
  if (amt !== undefined && amt !== null) {
    return  amt.toLocaleString(undefined, {
      style: "currency",
      currency: "MMK",
    });
  } 
  
};
export var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

