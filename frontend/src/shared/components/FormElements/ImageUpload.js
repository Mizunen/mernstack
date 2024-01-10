import "./ImageUpload.css";

import React, { useState, useEffect, useRef } from "react";

import Button from "./Button";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewImg, setPreviewImg] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();
  const pickImageHandler = (event) => {
    filePickerRef.current.click();
  };
  const pickedHandler = (event) => {
    console.log(event.target);
    let pickedFile;
    let fileIsValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);

      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  useEffect(() => {
    if (!file) {
      return;
    } else {
      const fileReader = new FileReader(); //can convert files into outputtable url
      fileReader.onload = () => {
        //executes when file is read
        setPreviewImg(fileReader.result); // .result returns the parsed file
      };
      fileReader.readAsDataURL(file);
    }
  }, [file]);
  return (
    <div className="form-control">
      <input
        type="file"
        id={props.id}
        style={{ display: "none" }}
        accept=".jpg, .png, .jpeg"
        ref={filePickerRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewImg && <img src={previewImg} alt="Preview" />}
          {!previewImg && <p>Please select an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
