/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import {
  Button,
} from '@material-ui/core';

function ImgUpload({ onChange, src }) {
  return (
      <>
          <label htmlFor="photo-upload" className="custom-file-upload fas">
              <div className="img-wrap img-upload">
                  <img htmlFor="photo-upload" src={src} />
              </div>
              <input id="photo-upload" type="file" onChange={onChange} />
          </label>
      </>
  );
}

function Name({
  onChange,
  value,
}) {
  return (
      <>
          <div className="field">
              <label htmlFor="name">
                  name:
              </label>
              <br />
              {' '}
              <br />
              <input
                id="name"
                type="text"
                onChange={onChange}
                maxLength="25"
                value={value}
                placeholder="Name"
                required
              />
          </div>
      </>
  );
}

// eslint-disable-next-line no-unused-vars
function Status({
  onChange,
  value,
}) {
  return (
      <>
          <div className="field">
              <label htmlFor="status">
                  status:
              </label>
              <input
                id="status"
                type="text"
                onChange={onChange}
                maxLength="35"
                value={value}
                placeholder="It's a nice day!"
                required
              />
          </div>
      </>
  );
}

function Profile({
  onSubmit,
  src,
  name,
  status,
}) {
  return (
      <>
          <div className="card">
              <form onSubmit={onSubmit}>
                  <h1>Upload Photo</h1>
                  <label className="custom-file-upload fas">
                      <div className="img-wrap">
                          <img htmlFor="photo-upload" src={src} />
                      </div>
                  </label>
                  <div className="name">{name}</div>
                  <div className="status">{status}</div>
                  <button type="submit" className="edit">Edit Profile </button>
              </form>
          </div>
      </>
  );
}

function Edit({
  onSubmit,
  children,
}) {
  return (
      <>
          <div className="card">
              <form onSubmit={onSubmit}>
                  <h1>Upload Photo</h1>
                  {children}
                  <br />
                  {' '}
                  <br />
                  <Button style={{ backgroundColor: '#64D3A6', color: '#fff' }}>Save </Button>
              </form>
          </div>
      </>
  );
}

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: 'https://i.pinimg.com/474x/f1/da/a7/f1daa70c9e3343cebd66ac2342d5be3f.jpg',
      name: '',
      status: '',
      active: 'edit',
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // const activeP = this.state.active === 'edit' ? 'profile' : 'edit';
    this.setState((prevState) => ({
      active: prevState.active === 'edit' ? 'profile' : 'edit',
    }));
  }

  photoUpload(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }

  editName(e) {
    const name = e.target.value;
    this.setState({
      name,
    });
  }

  editStatus(e) {
    const status = e.target.value;
    this.setState({
      status,
    });
  }

  render() {
    const {
      imagePreviewUrl,
      name,
      status,
      active,
    } = this.state;
    console.log(imagePreviewUrl);
    console.log(name);
    return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        >
            {(active === 'edit') ? (
                <Edit onSubmit={(e) => this.handleSubmit(e)}>
                    <ImgUpload onChange={(e) => this.photoUpload(e)} src={imagePreviewUrl} />
                    <Name onChange={(e) => this.editName(e)} value={name} />
                </Edit>
            ) : (
                <Profile
                  onSubmit={this.handleSubmit}
                  src={imagePreviewUrl}
                  name={name}
                  status={status}
                />
            )}

        </div>
    );
  }
}

export default InputForm;
