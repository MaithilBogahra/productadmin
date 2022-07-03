import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import * as yup from 'yup';
import { useFormik, Form, Formik } from 'formik';
import { DataGrid } from '@mui/x-data-grid';
import { getFormLabelUtilityClasses } from '@mui/material';


function Product(props) {
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState([]);
    const [dopen, setDOpen] = React.useState(false);
    const [did, setDid] = useState();
    const [update, setUpdate] = useState(false)


    const handleDClickOpen = () => {
        setDOpen(true);
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDOpen(false);
    };

    let schema = yup.object().shape({
        productname: yup.string().required("Product Name is Required"),
        productdetails: yup.string().required("Product Details is Required"),
        productprice: yup.number().required("Product Price is Required").positive().integer(),

    })
    const formik = useFormik({
        initialValues: {
            productname: '',
            productdetails: '',
            productprice: '',
        },
        validationSchema: schema,
        onSubmit: values => {
            if (update) {
                handleUpdate(values)
            } else {
                handleAddition(values);
            }
        }
    });

    const columns = [
        { field: 'productname', headerName: 'Product Name', width: 70 },
        { field: 'productdetails', headerName: 'Product Details', width: 130 },
        { field: 'productprice', headerName: 'product Price', width: 130 },
        {
            field: 'action',
            headerName: 'Action',
            width: 130,
            renderCell: (params) => (
                <>
                    <IconButton aria-label="delete" onClick={() => { handleDClickOpen(); setDid(params.id) }}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={() => handleEdit(params)}>
                        <EditIcon />
                    </IconButton>
                </>
            )
        },

    ];


    const { handleBlur, handleChange, handleSubmit, errors, touched, values } = formik;



    const handleAddition = (values) => {

        const id = Math.floor(Math.random() * 1000);
        const data = {
            id: id,
            ...values
        }
        const localData = JSON.parse(localStorage.getItem('Product'));

        console.log(localData);
        if (localData === null) {
            localStorage.setItem('Product', JSON.stringify([data]));
        } else {
            localData.push(data);
            localStorage.setItem('Product', JSON.stringify(localData));
        }

        handleClose();
        loadData();
        formik.resetForm();
    }

    const loadData = () => {
        let localData = JSON.parse(localStorage.getItem("Product"));
        if (localData !== null) {
            setData(localData);
        }

    }

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = (params) => {
        let localData = JSON.parse(localStorage.getItem("Product"))
        const fdata = localData.filter((l) => l.id !== did)
        localStorage.setItem("Product", JSON.stringify(fdata));

        loadData();
        handleClose();

    }
    const handleEdit = (params) => {
        handleClickOpen();
        setUpdate(true);

        formik.setValues(params.row)

    }
    const handleUpdate=(values) =>{
        let localData = JSON.parse(localStorage.getItem('Product'));

        let udata= localData.map((u) =>{
            if(u.id === values.id){
                return values;
            }else{
                return u;
            }
        });
        localStorage.setItem("Product", JSON.stringify(udata));
        loadData();
        handleClose();
        setUpdate(false);
        formik.resetForm();
    }


    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open Product
            </Button>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </div>
            <Dialog
                fullWidth
                open={dopen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are You Sure Delete?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth open={open} onClose={handleClose}>

                <DialogTitle>Product</DialogTitle>

                <Formik values={formik}>
                    <Form onSubmit={handleSubmit}>
                        <DialogContent>

                            <TextField
                                value={values.productname}
                                margin="dense"
                                id="productname"
                                name='productname'
                                label="Product Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.productname && touched.productname ? (<p>{errors.productname}</p>) : ("")}
                            <TextField
                                value={values.productdetails}
                                margin="dense"
                                id="productdetails"
                                name='productdetails'
                                label="Product details"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.productdetails && touched.productdetails ? (<p>{errors.productdetails}</p>) : ("")}
                            <TextField
                                value={values.productprice}
                                margin="dense"
                                id="productprice"
                                name='productprice'
                                label="Product Price"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.productprice && touched.productprice ? (<p>{errors.productprice}</p>) : ("")}
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            {
                                update ? 
                                <Button type='submit'>Update</Button>
                                :
                                <Button type='submit'>Submit</Button>
                            }
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
        </div>

    );
}

export default Product;