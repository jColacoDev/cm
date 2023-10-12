import "./DragAndDrop.scss"
import React from 'react'

export default function DragAndDrop({onSubmit, onFilesChange}) {
    // const [disabledDownload, setDisabledDownload] = React.useState(true);
    const [disabledUpload, setDisabledUpload] = React.useState(true);
    const [newFilesUploaded, setNewFilesUploaded] = React.useState(true);
    const [fileError, setFileError] = React.useState("");
    const [dragActive, setDragActive] = React.useState(false);
    const [selectedFilesList, setSelectedFilesList] = React.useState([]);
    const inputRef = React.useRef(null);


    React.useEffect(() => {
        let flag = fileError !== "" || selectedFilesList < 1;

        setDisabledUpload(newFilesUploaded || flag);
        // setDisabledDownload(!newFilesUploaded || flag);
    
    }, [fileError, selectedFilesList, newFilesUploaded]);

    function swapArrayElements(arr, indexA, indexB) {
        const temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    }

    function handleFile(files) {
        let html_number= 0;
        let invalid_ext= false;

        let auxList = [];
        Array.from(files).forEach((file, i) =>{
            auxList = [...auxList, file.name]
			const ext= file.name.split('.').pop();

            if(ext !== "html" && ext !== "css") invalid_ext = true;

            if(ext === "html") {
                html_number++;
                if(i !== 0) swapArrayElements(auxList, 0, i)
            }
        });

        if(invalid_ext){
            setFileError("Only HTML and CSS accepted"); 
            onFilesChange([]);
            setSelectedFilesList([]);
        }else if(html_number !== 1){
            if(html_number === 0){
                setFileError("No HTML uploaded"); 
            }
            else{
                setFileError("Only one HTML accepted"); 
            }
            onFilesChange([]);
            setSelectedFilesList([]);
        }else{
            setFileError("");
            onFilesChange(files);
            setSelectedFilesList(auxList);
        }
        setNewFilesUploaded(false);
    }

    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    
    // triggers when file is dropped
    const handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files);
        }
    };
    
    // triggers when file is selected with click
    const handleChange = function(e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files);
        }
    };
    
    // triggers the input when the button is clicked
    const onButtonClick = () => {
        inputRef.current.click();
    };

  return (
    <div className="DragAndDrop">
        <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={onSubmit}>
        <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
            <section>
                <article>
                    <p>Drag and drop your file here or</p>
                    <button className="upload-button" onClick={onButtonClick}>Upload all files at once</button>
                    <figure></figure>
                </article>
                <article>
                    <ul>
                        {fileError !== "" && <li><span><strong>Error:</strong></span>{fileError}</li>}
                        {selectedFilesList.map((element, i) => <li key={i}>{element}</li>)}
                    </ul>   
                </article>
            </section> 
        </label>
        { dragActive && 
            <div id="drag-file-element" 
                onDragEnter={handleDrag} 
                onDragLeave={handleDrag} 
                onDragOver={handleDrag} 
                onDrop={handleDrop}>
            </div> 
        }
            <button disabled={disabledUpload} onClick={()=>setNewFilesUploaded(true)} type="submit">Upload</button>
            {/* <button disabled={disabledDownload} onClick={(e)=>onDownload(e)}>Download</button> */}
        </form>
    </div>
  )
}
