import React, { useEffect } from 'react';
import { styled } from '@mui/system';
import {
    TablePagination,
    tablePaginationClasses as classes,
} from '@mui/base/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

import { formatDateToLocaleString } from '../helper';
import { useDataContext } from '../context';

let rowsPerPageOptions = [5, 10, 25, { label: 'All', value: -1 }]

export default function TableCustomized({ data, handleDelete, showBudget = true, showAction = true }) {
    const navigate = useNavigate();
    const { updateData } = useDataContext();
    const [tableData, setTableData] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const editExpense = (expense) => {
        updateData({ type: 'expense', data: expense })
        scrollToTop();
    }

    const deleteExpense = async (expense) => {
        handleDelete(expense._id)
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: adds a smooth scrolling effect
        });
    };

    useEffect(() => {
        if (data) {
            setTableData(data);

        }
    }, [data]);

    const totalExpenses = () => {
        return tableData?.reduce((accumulator, object) => {
            return accumulator + object.amount;
        }, 0);
    }

    return (
        <Root sx={{ width: '100%' }}>
            <table aria-label="custom pagination table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Amount (MMK)</th>
                        {showBudget && <th >Budget</th>}
                        <th>Created At</th>
                        {showAction && <th >Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {
                        (rowsPerPage > 0
                            ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : tableData
                        )
                            .map((row, index) => (
                                <tr key={index}>
                                    <td data-label="No" >{index = index + 1}</td>
                                    <td data-label="Name">{row.name}</td>
                                    <td align="right" data-label="Amount">
                                        {row.amount}
                                    </td>
                                    {showBudget && (
                                        <td data-label="Budget">
                                            <span
                                                onClick={() => navigate(`/home/budget/${row.budgetId?._id}`)}
                                                style={{
                                                    "color": `hsl(${row.budgetId?.color})`, "cursor": "pointer"
                                                }}
                                            >
                                                {row.budgetId?.name}
                                            </span>
                                        </td>
                                    )}

                                    <td align="right" data-label="Created At">
                                        {formatDateToLocaleString(row.createdAt)}
                                    </td>
                                    {showAction &&
                                        <td align="left" data-label="Action">
                                            <Tooltip title="To edit the expense, see the above update expense form!">
                                                <IconButton aria-label="edit" onClick={() => editExpense(row)} size="small" color='success'>
                                                    <EditIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton aria-label="delete" size="small" color="error" onClick={() => deleteExpense(row)}>
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        </td>

                                    }

                                </tr>
                            ))}

                    {emptyRows > 0 && (
                        <tr style={{ height: 34 * emptyRows }}>
                            <td colSpan={4} aria-hidden />
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr >
                        <td style={{
                            "color": "red"
                        }} align="right" colSpan={5}>Total : {totalExpenses()}</td>
                    </tr>
                    <tr>
                        <CustomTablePagination
                            rowsPerPageOptions={rowsPerPageOptions}
                            colSpan={5}
                            count={tableData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                    'aria-label': 'rows per page',
                                },
                                actions: {
                                    showFirstButton: true,
                                    showLastButton: true,
                                },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </tr>
                </tfoot>
            </table>
        </Root>
    );
}

const blue = {
    50: '#F0F7FF',
    200: '#A5D8FF',
    400: '#3399FF',
    900: '#1976d2',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Root = styled('div')(
    ({ theme }) => `
 table {
  border: 1px solid whitesmoke;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
  -webkit-transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12);
}

table tr {
  padding: .35em;
}

table th,
table td {
  padding: .625em;
  text-align: center;
}

table th {
  background-color: #1976d2;
  color:white;
  font-family: "Roboto","Helvetica","Arial",sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.43;
  letter-spacing: 0.01071em;
}

table th:first-of-type {
  border-radius: 4px 0px 0px 4px;
}
table th:last-child {
  border-radius: 0px 4px 4px 0px;
}

@media screen and (max-width: 600px) {
  table {
    border: 0;
  }
  table tr:last-child {
    border-bottom: 0;
  }
  table caption {
    font-size: 1.3em;
  }
  
  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  
  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: .625em;
  }
  
  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: .8em;
    text-align: right;
  }
  
  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
  }
  
  table td:last-child {
    border-bottom: 0;
  }
}
  `,
);

const CustomTablePagination = styled(TablePagination)(
    ({ theme }) => `
  & .${classes.spacer} {
    display: none;
  }

  & .${classes.toolbar}  {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.select}{
    padding: 2px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    border-radius: 50px;
    background-color: transparent;

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    }

    &:focus {
      outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
    }
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.actions} {
    padding: 2px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    border-radius: 50px;
    text-align: center;
  }

  & .${classes.actions} > button {
    margin: 0 8px;
    border: transparent;
    border-radius: 2px;
    background-color: transparent;

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    }

    &:focus {
      outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
    }
  }
  `,
);