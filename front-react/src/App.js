import React from 'react';

class App extends React.Component{
  constructor(props){
    super(props)
    

    this.handleUploadedImage=this.handleUploadedImage.bind(this)
  }

  handleUploadedImage(ev){
    ev.preventDefault();
    var data=new FormData()
    data.append('file',this.uploadInput.files[0])
    fetch('http://localhost:4000/upload',{
      method:'POST',
      body:data
    }).then((response)=>{
      console.log("response"+response)
    }).catch((err)=>{
      console.log(err)
    })
  }
  render(){
    return(
      <div>
        <h1>Upload file</h1>
        <form onSubmit={this.handleUploadedImage} enctype="multipart/form-data">
          <div>
            <input ref={(ref)=>{this.uploadInput=ref;}} type="file"/>
          </div>
          <div>
            <button>Upload</button>
          </div>
        </form>
      </div>
    )
  }
  
}

export default App;
