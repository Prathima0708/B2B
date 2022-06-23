import React, { useState, useContext, useEffect } from 'react';
import PageTitle from "../../components/Typography/PageTitle";
import {
    Table,
    TableHeader,
    TableCell, TableRow,
    TableBody,
    TableContainer,
    Button,
    Card,
    CardBody, Input, Select, Badge, Modal, ModalBody, ModalFooter
} from "@windmill/react-ui";
import { FiPlus } from "react-icons/fi";
// import { SidebarContext } from "../../context/SidebarContext";
import Drawer from 'rc-drawer';
import { FiX } from 'react-icons/fi';
import Title from "../../components/form/Title";
import Scrollbars from "react-custom-scrollbars";
import LabelArea from "../../components/form/LabelArea";
import locale from 'react-json-editor-ajrm/locale/en';
import { GET_ALL_VARIFIED_STORE, REG_DRIVER, GET_REG_DRIVER, ACTIVATE_REG_DRIVER, EDIT_DRIVER } from './constants';
import apiService from "../../utils/apiService";
import { apiServiceAuth } from "../../utils/constants";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from "../../components/tooltip/Tooltip";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { notifyError, notifySuccess } from "../../utils/toast";
import NotFound from "../../components/table/NotFound";
import Grid from "@mui/material/Grid";
import moment from "moment";
import Switch from "@mui/material/Switch";
import { alpha, styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';

function DeliveryExecutive() {
    const [showDrawer, setShowDrawer] = useState(false);
    const [name, setName] = useState("");
    const [email_id, setEmail_id] = useState("");
    const [gender, setGender] = useState("MALE");
    const [mobile, setMobile] = useState("");
    const [dob, setDob] = useState("");
    const [storeIds, setStoreIds] = useState([]);
    const [vendor_id, setVendor_id] = useState(0);
    const [city_id, setCity_id] = useState(0);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [state, setState] = useState("");

    const [cityIdSearch, setCityIdSearch] = useState(null);
    const [sellerId, setSellerId] = useState(0);

    const [edit_driver, setEdit_driver] = useState(null);

    const [del_config, setDel_config] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [driverList, setDriverList] = useState([]);

    const [emailValidation, setEmailValidation] = useState(false);
    const [mobilelValidation, setMobilelValidation] = useState(false);

    const reset = () => {
        setName(""); setEmail_id(""); setMobile(""); setDob("");
        setAddress(""); setCity(""); setPincode(""); setState("");
        setEdit_driver(null);setEmailValidation(false);setMobilelValidation(false);
    }

    const getStoreList = () => {
        apiService
            .get("b2b", GET_ALL_VARIFIED_STORE, { verifiedStatus: true })
            .then((response) => {
                if (response) {
                    setStoreIds(response.data.result);
                    // if (response.data.result.length > 0) {
                    //     setVendor_id(response.data.result[0].id);
                    // }
                } else {
                    notifyError("Something went wrong !!")
                }
            })
            .catch((e) => {
                notifyError("Something went wrong !!")
            });
    }

    const getDriverOnSearch = () => {
        setIsLoading(true)
        apiServiceAuth
            .get("eLocals", GET_REG_DRIVER + sellerId, null)
            .then((response) => {
                setIsLoading(false)
                if (response) {
                    parseInt(sellerId) === 0 ?setDriverList(response.data.data.externalDeliveryExecutive) : setDriverList(response.data.data.internalDeliveryExecutive);
                } else {
                    // notifyError("Something went wrong !!")
                }
            })
            .catch((e) => {
                setIsLoading(false)
                notifyError("Something went wrong !!")
            });
    }

    const activateDriverId = (id) => {
        setIsLoading(true)
        apiServiceAuth
            .put("eLocals", ACTIVATE_REG_DRIVER + id, null)
            .then((response) => {
                setIsLoading(false)
                if (response) {
                    getDriverOnSearch();
                } else {
                    notifyError("Something went wrong !!")
                }
            })
            .catch((e) => {
                setIsLoading(false)
                notifyError("Something went wrong !!")
            });
    }

    useEffect(() => {
        getDriverOnSearch();
    }, [sellerId]);

    const addDriver = (flg) => {
        let payload = {
            "address": {
                "address": address,
                "city": city,
                "pincode": pincode,
                "state": state
            },
            "city_id": city_id,
            "dob": moment(dob).format("YYYY-MM-DD") + 'T01:00:00.341Z',
            "email_id": email_id,
            "gender": gender,
            "mobile": mobile,
            "name": name,
            "vendor_id": vendor_id
        }
        setShowDrawer(false);
        setIsLoading(true)
        if (!flg) {
            apiServiceAuth
                .post("eLocals", REG_DRIVER, payload)
                .then((response) => {
                    if (response) {
                        notifySuccess("Driver Added !!");
                        getDriverOnSearch();
                    } else {
                        notifyError("Something went wrong !!")
                    }
                    setIsLoading(false)
                })
                .catch((e) => {
                    notifyError("Something went wrong !!")
                    setIsLoading(false)
                });
        } else{
            payload.driving_licence_number = edit_driver.drivingLicenceNumber;
            payload.driving_licence_url = edit_driver.drivingLicenceUrl;
            payload.id_proof_type = edit_driver.idProofType;
            payload.id_proof_url = edit_driver.idProofUrl;
            payload.profile_pic_url = edit_driver.profilePicUrl;
            payload.vehicle_no_plate_url = edit_driver.vehicleNumber;
            payload.vehicle_number = edit_driver.vehicleNoPlateUrl && edit_driver.vehicleNoPlateUrl!=null ? edit_driver.vehicleNoPlateUrl : '';
            payload.vehicle_paper_url = edit_driver.vehiclePaperUrl;
            payload.vehicle_pic_url = edit_driver.vehiclePicUrl;
            apiServiceAuth
                .put("eLocals", EDIT_DRIVER+edit_driver.id, payload)
                .then((response) => {
                    if (response) {
                        notifySuccess("Driver Edited !!");
                        getDriverOnSearch();
                    } else {
                        notifyError("Something went wrong !!")
                    }
                    setIsLoading(false)
                })
                .catch((e) => {
                    notifyError("Something went wrong !!")
                    setIsLoading(false)
                });
        }
    }

    const deleteConfig = (index) => {

    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        getStoreList();
        var d = document.getElementsByClassName("drawer-content");
        d[0].className += " bg-white dark:bg-gray-800 dark:text-gray-300";
    }, []);

    useEffect(() => {
        if (!showDrawer)
            reset()
    }, [showDrawer]);

    const GreenSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: green[600],
          '&:hover': {
            backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
          },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: green[600],
        },
      }));

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Drawer
                open={showDrawer}
                onClose={() => { }}
                parent={null}
                level={null}
                placement={'right'}
            >
                <div className="flex p-6 flex-col w-full h-full justify-between dark:bg-gray-800 dark:text-gray-300">
                    <div className="w-full relative  bg-white dark:bg-gray-800 dark:text-gray-300">
                        <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 bg-white dark:bg-gray-800 dark:text-gray-300">
                            <div className="col-span-8 sm:col-span-4">
                                <div className="top-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    <Title
                                        title={edit_driver === null ? "Add Driver" : "Edit Driver"}
                                        description={edit_driver === null ? "Add your Driver and necessary information from here" :
                                            "Edit your Driver Info and necessary information from here"}
                                    />
                                    <button
                                        onClick={() => {
                                            setShowDrawer(false)
                                        }}
                                        className="absolute focus:outline-none z-50 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-2 right-0 left-auto w-10 h-10 rounded-full block text-center"
                                    >
                                        <FiX className="mx-auto" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* <br /><br /><br /> */}
                        <Scrollbars className="w-full  relative mt-2" style={{ height: "120vh" }}>
                            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                <LabelArea label="Name" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Input
                                        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                        label="Name"
                                        name="Name"
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                <LabelArea label="Email" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Input
                                        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                        label="Email Value"
                                        name="Email"
                                        type="text"
                                        placeholder="Email"
                                        value={email_id}
                                        valid={emailValidation}
                                        onChange={(e) => {
                                            var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                                            setEmail_id(e.target.value)
                                            if (e.target.value.match(validRegex)) {
                                                setEmailValidation(true);
                                            } else {
                                                setEmailValidation(false);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                <LabelArea label="Data Type" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Select className="mt-1" value={gender} onChange={(e) => {
                                        setGender(e.target.value);
                                    }}>
                                        <option value="MALE">{"Male"}</option>
                                        <option value="FEMALE">{"Female"}</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                <LabelArea label="Mobile" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Input
                                        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                        label="Mobile Value"
                                        name="Mobile"
                                        type="text"
                                        placeholder="Mobile"
                                        valid={mobilelValidation}
                                        value={mobile}
                                        onChange={(e) => {
                                            var validRegex = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
                                            setMobile(e.target.value)
                                            if (e.target.value.match(validRegex)) {
                                                setMobilelValidation(true);
                                            } else {
                                                setMobilelValidation(false);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                <LabelArea label="Date of Birth" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Input
                                        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                        label="DOB"
                                        name="DOB"
                                        type="date"
                                        placeholder="DOB"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                <LabelArea label="Vendor" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Select className="mt-1" value={vendor_id} onChange={(e) => {
                                        setVendor_id(e.target.value);
                                    }}>
                                        <option value={0} key={"Baqaala"}>{"Baqaala"}</option>
                                        {storeIds.map((str, i) => {
                                            return <option value={str.id} key={i}>{str.name}</option>
                                        })}
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                <LabelArea label="Address Information" />
                                <div className="col-span-8 sm:col-span-4"></div>
                            </div>
                            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                <LabelArea label="Address" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Input
                                        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                        label="address"
                                        name="address"
                                        type="text"
                                        placeholder="Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                                <LabelArea label="City" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Input
                                        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                        label="city"
                                        name="City"
                                        type="text"
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <LabelArea label="State" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Input
                                        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                        label="State"
                                        name="State"
                                        type="text"
                                        placeholder="State"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                    />
                                </div>
                                <LabelArea label="Pincode" />
                                <div className="col-span-8 sm:col-span-4">
                                    <Input
                                        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                        label="Pincode"
                                        name="Pincode"
                                        type="text"
                                        placeholder="pincode"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                    />
                                </div><br/><br/>
                            </div>
                            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                <div className="col-span-8 sm:col-span-4">
                                    <div className="fixed bottom-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                            <Button
                                                onClick={() => {
                                                    setShowDrawer(false)
                                                }}
                                                className="h-12 bg-white w-full text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700"
                                                layout="outline"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                            <Button disabled={!(emailValidation && mobilelValidation)} type="submit" className="w-full h-12" onClick={() => {
                                                let editFlag = edit_driver != null ? true : false;
                                                addDriver(editFlag);
                                            }}>
                                                {" "}
                                                <span>{edit_driver === null ? "Add" : "Edit"} </span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Scrollbars>
                    </div>
                </div>
            </Drawer>
            <PageTitle>Driver Executive</PageTitle>
            <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
                <CardBody>
                    <form onSubmit={() => {
                        // handleSubmitCategory
                    }} className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">

                        <div className="w-full md:w-56 lg:w-56 xl:w-56" style={{ width: "100%" }}>
                            <Button onClick={() => {
                                setShowDrawer(true)
                            }} className="w-full rounded-md h-12">
                                <span className="mr-3">
                                    <FiPlus />
                                </span>
                                Driver Registeration
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
            <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
                <CardBody>
                    <Grid container spacing={3}>
                        <Grid item lg={4} md={4} sm={6} xs={12} className="pt-1">
                            {/* <Input
                                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                label="City ID"
                                name="cityId"
                                type="number"
                                placeholder="City ID"
                                value={cityIdSearch}
                                onChange={(e) => {
                                    setCityIdSearch(e.target.value);
                                }}
                            /> */}
                            <LabelArea label="Vendor" />
                            <div className="col-span-8 sm:col-span-4">
                                <Select className="mt-1" value={sellerId} onChange={(e) => {
                                    setSellerId(e.target.value);
                                }}>
                                    <option value={0} key={"Baqaala"}>{"Baqaala"}</option>
                                    {storeIds.map((str, i) => {
                                        return <option value={str.id} key={i}>{str.name}</option>
                                    })}
                                </Select>
                            </div>

                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12} className="pt-1">
                            {/* <Input
                                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                label="Seller ID"
                                name="sellerId"
                                type="number"
                                placeholder="Seller ID"
                                value={sellerId}
                                onChange={(e) => {
                                    setSellerId(e.target.value);
                                }}
                            /> */}
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12} className="pt-1">
                            {/* <Button onClick={() => {
                                getDriverOnSearch();
                            }} className="w-full rounded-md h-12">
                                <span className="mr-3">
                                    <FiSearch />
                                </span>
                                Search User
                            </Button> */}
                        </Grid>
                    </Grid>
                </CardBody>
            </Card>
            {driverList.length > 0 ? <>
                <TableContainer className="mb-8">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>ID</TableCell>
                                <TableCell>NAME</TableCell>
                                <TableCell>EMAIL</TableCell>
                                <TableCell>MOBILE</TableCell>
                                <TableCell /*className="text-right"*/>ACTIVE</TableCell>
                                <TableCell /*className="text-right"*/>ACTION</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {driverList.map((config, index) => {
                                return <TableRow key={index} className="cursor-pointer">
                                    <TableCell className="font-semibold uppercase text-xs">{config.id}</TableCell>
                                    <TableCell className="font-semibold uppercase text-xs">{config.name}</TableCell>
                                    <TableCell className="font-semibold uppercase text-xs">{config.emailId}</TableCell>
                                    <TableCell className="font-semibold uppercase text-xs">{config.mobile}</TableCell>
                                    <TableCell>
                                        {/* <Badge
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                activateDriverId(config.id);
                                            }}
                                            type={config.active ? "success" : "danger"}
                                        >
                                            {config.active ? "Active" : "Inactive"}
                                        </Badge> */}
                                        <GreenSwitch key={index}
                                            checked={config.active}
                                            // onChange={handleShow}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                activateDriverId(config.id);
                                            }}/>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex ">
                                            <div
                                                onClick={() => {
                                                    setEdit_driver(config);
                                                    setShowDrawer(true);setEmailValidation(true);setMobilelValidation(true);
                                                    setName(config.name); setEmail_id(config.emailId); setMobile(config.mobile); setDob(config.dob);setVendor_id(config.vendorId);
                                                    setAddress(config.address.address); setCity(config.address.city); setPincode(config.address.pincode); setState(config.address.state);
                                                }}
                                                className="p-2 cursor-pointer text-gray-400 hover:text-green-600"
                                            >
                                                <Tooltip id="edit" Icon={FiEdit} title="Edit" bgColor="#10B981" />
                                            </div>

                                            {/* <div
                                                onClick={() => { setDel_config(config.id) }}
                                                className="p-2 cursor-pointer text-gray-400 hover:text-red-600"
                                            >
                                                <Tooltip id="delete" Icon={FiTrash2} title="Delete" bgColor="#EF4444" />
                                            </div> */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <>
                    <Modal isOpen={del_config} onClose={() => {
                        setDel_config(false);
                    }}>
                        <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
                            <span className="flex justify-center text-3xl mb-6 text-red-500">
                                <FiTrash2 />
                            </span>
                            <h2 className="text-xl font-medium mb-1">Are You Sure! Want to Delete This Record?</h2>
                            <p>
                                Do you really want to delete these records? You can't view this in your list anymore if you
                                delete!
                             </p>
                        </ModalBody>
                        <ModalFooter className="justify-center">
                            <Button
                                className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
                                layout="outline"
                                onClick={() => {
                                    setDel_config(false)
                                }}
                            >
                                No, Keep It
                            </Button>
                            <Button onClick={() => {
                                deleteConfig(del_config);
                            }} className="w-full sm:w-auto">
                                Yes, Delete It
                            </Button>
                        </ModalFooter>
                    </Modal>
                </>
            </> : <NotFound title="App ConFig" />}

        </>
    );
}


export default DeliveryExecutive;