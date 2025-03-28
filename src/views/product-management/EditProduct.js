import React, { useEffect, useState  } from "react";
import { Layout, Form, Input, Button, message,  Select, Upload, Row, Col } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import {updateproduct , getProductById , createsubServices , getallServices , subCatByCategory ,createProduct } from '../../redux/thunk/serviceSlice'
import { useNavigate , useParams } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import ImageUploading from 'react-images-uploading';
import { createServices } from '../../redux/thunk/serviceSlice'


const { TextArea } = Input;

function AddCategory() {
   const token = useSelector((state) => state?.user?.data?.token );
   let id = useParams()
    console.log("ggggg====================>" , id);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [images, setImages] = useState([]);
  const [cat , Setcat ] = useState([])
  const [subCat , SetsubCat] = useState("")
  const [ subCategory , SetsubCategory ] = useState("")
  const [selectedCategory , subselectedCategory ] = useState("")
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [productDetail , SetproductDetail] = useState([])

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const getProductData = async () => {
    const data = {
        id : id?.id ,
        token : token
    }
   
    const productData = await dispatch(getProductById(data)).unwrap()
    SetproductDetail(productData?.data?.datefilter[0])
    
  }



  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Ensure only one file is kept
  };

  const onChange32 = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const handleStatusChange = async (e) => {
    SetsubCat(e)
    console.log("---- new --->" , e);
    const data = {
        id : e ,
        token : token
    }
    const catChange = await dispatch(subCatByCategory(data)).unwrap()

    const datas = catChange.selectedSubCategory?.map((names) =>({
        value: names._id,
        label: names.title

     }))
    subselectedCategory(datas);
  }


  console.log("selectedCategory123",selectedCategory);
  const handleSubCategory = async () => {

  }

  const getAllCategories = async () => {
    const response = await dispatch(getallServices(token)).unwrap()
     const datas = response?.allcategory?.map((names) =>({
        value: names._id,
        label: names.title

     }))
     Setcat(datas)
  }


  useEffect(() => {
    getAllCategories()
    getProductData()
  },[])

  const handleSubCatChange = (e) => {
    SetsubCategory(e)
  }

  console.log("===== productDetail ====>",productDetail);

  const onFinish =  async (values) => {
    setLoading(true);
   const {title , description ,price , weight} = values
    console.log("2222",title , description ,price , weight);
    const userData = {
      title : title ? title : productDetail?.title,
      subCatId :subCategory ? subCategory : productDetail?.subCatId,
      description : description ? description : productDetail?.description, 
      price : price ? price : productDetail?.price ,
      weight : weight ? weight : productDetail?.weight
    }

    setLoading(false);
    const data = {
        id : id?.id,
      token : token,
      payload : userData
    }

    console.log("data22222" , data);

    const newCategory = await dispatch(updateproduct(data)).unwrap()

    if(newCategory?.status){
      navigate('/product')
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Layout>
      <div className="boxDetails">
        <Row style={{ padding: "10px 20px" }}>
          <Col
            xs={24}
            md={12}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FaArrowLeft
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
              onClick={() => navigate(-1)}
            />
            &emsp;
            <h1 className="pageName" style={{ margin: 0 }}>
              EDIT PRODUCT
            </h1>
          </Col>
        </Row>
        <Row align="middle" gutter={24}>
      

          <Col lg={6} md={24} xs={24}>
            <Form
              className="row g-3"
              name="basic"
              layout="vertical"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
              onFinishFailed={onFinishFailed}
              form={form}
            >

                <p className="mainLabel">Select Category:</p>
                <>
                        <Select
                        size={"large"}
                        className="filterSelectBox"
                        placeholder="Select Status"
                        value={productDetail?.category?.title || cat?.label}
                        onChange={(e) => {
                            handleStatusChange(e)

                            }}
                        style={{
                            width: "100%",
                            marginBottom: "10px",
                            textAlign: "left",
                        }}
                        options={cat}
                        />
                    </>

                {
                    productDetail.subCatId  ? (
                        <>
                            <p className="mainLabel">Select Sub Category:</p>

                            <Select
                            size={"large"}
                            className="filterSelectBox"
                            placeholder="Select Sub Category"
                            value={productDetail?.subCatName}
                            onChange={(e) => {
                                handleSubCatChange(e)
                                }}
                            style={{
                                width: "100%",
                                marginBottom: "10px",
                                textAlign: "left",
                            }}
                            options={selectedCategory}
                            />
                        </>
                    )
                    :
                    (
                        <>
                            <p className="mainLabel">Select Sub Category:</p>

                            <Select
                            size={"large"}
                            className="filterSelectBox"
                            placeholder="Select Sub Category"
                            value={selectedCategory?.label}
                            onChange={(e) => {
                                handleSubCatChange(e)
                                }}
                            style={{
                                width: "100%",
                                marginBottom: "10px",
                                textAlign: "left",
                            }}
                            options={selectedCategory}
                            />
                        </> 
                    )
                }

              <Form.Item
                label="Product Title"
                name="title"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please input Product Title!",
                //   },
                // ]}
              >
                <Input
                  size="large"
                  placeholder={productDetail?.title}
                  style={{
                    borderRadius: "5px",
                    background: "white",
                    fontSize: "14px",
                    padding: "12px 20px",
                  }}
                />
              </Form.Item>

              
              <Form.Item
                label="Product Description"
                name="description"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please input Product Description!",
                //   },
                // ]}
              >
                <Input
                  size="large"
                  placeholder={productDetail.description}
                //   value={productDetail.description}
                  style={{
                    borderRadius: "5px",
                    background: "white",
                    fontSize: "14px",
                    padding: "12px 20px",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Product Price"
                name="price"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please input Product Price!",
                //   },
                // ]}
              >
                <Input
                  type="number"
                  size="large"
                  placeholder={productDetail.price}
                 // value={productDetail.title}
                  style={{
                    borderRadius: "5px",
                    background: "white",
                    fontSize: "14px",
                    padding: "12px 20px",
                  }}
                />
              </Form.Item>


              <Form.Item
                label="Product Weight"
                name="weight"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please input Product Weight!",
                //   },
                // ]}
              >
                <Input
                  size="large"
                  placeholder={productDetail.weight}
                  //value={productDetail.title}
                  style={{
                    borderRadius: "5px",
                    background: "white",
                    fontSize: "14px",
                    padding: "12px 20px",
                  }}
                />
              </Form.Item>


              
              {/* <p style={{ margin: "10px", fontWeight: "bold" }}>
                Upload Images*
              </p>
              <Form.Item
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "Please upload an image!",
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                  accept="image/*"
                  multiple={false}
                  maxCount={1} // Prevent automatic upload
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item> */}
              <br />
              <Row justify="">
                <Form.Item>
                  <Button
                    type="button"
                    htmlType="submit"
                    size={"large"}
                    style={{ padding: "12px 40px", height: "auto" }}
                    className="mainButton loginBtn"
                  >
                    EDIT
                  </Button>
                </Form.Item>
                &emsp;
                <Button
                  type="button"
                  htmlType="button"
                  size="large"
                  ghost
                  style={{
                    padding: "10px 40px",
                    height: "50px",
                    width: "154px",
                    borderColor: "#aeafaf",
                    color: "#aeafaf",
                  }}
                  className="mainButton cancelBtn"
                  onClick={() => navigate("/product")}
                >
                  CANCEL
                </Button>
              </Row>
            </Form>

           
          </Col>
        </Row>
      </div>
    </Layout>
  );
}

export default AddCategory;
