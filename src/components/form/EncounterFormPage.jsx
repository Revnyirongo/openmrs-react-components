import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { actions as toastrActions } from 'react-redux-toastr';
import uuidv4 from 'uuid/v4';
import { formActions } from '../../features/form';
import { FORM_STATES } from '../../features/form/constants';
import Submit from './Submit';
import Cancel from './Cancel';
import EncounterForm from './EncounterForm';
import Loader from './../widgets/Loader';

/**
 * Provides a basic wrapper around an Encounter Form with a title, toast success message, and afterSubmitLink
 * Handling fetching the encounter, managing state, etc
 */

class EncounterFormPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.enterEditMode = this.enterEditMode.bind(this);
    this.exitEditMode = this.exitEditMode.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    if (this.props.formInstanceId) {
      this.formInstanceId = this.props.formInstanceId;
    }
    else {
      this.formInstanceId = uuidv4();
    }

    this.formSubmittedActionCreators = [
      () => toastrActions.add({ title: "Data Saved", type: "success" })
    ];

    if (props.afterSubmitLink) {
      this.formSubmittedActionCreators.push(() => push(props.afterSubmitLink));
    }

    if (props.formSubmittedActionCreators) {
      this.formSubmittedActionCreators.push(...props.formSubmittedActionCreators);
    }

    // TODO extract styles out to a common location once we figure out our strategy for css?
    // TODO or potentially assign defaults here but allow to be overridden via props?
    this.rowStyles = {
      backgroundColor: '#ffa500b3'
    };

    this.littlePaddingLeft = {
      paddingLeft: '20px'
    };

    this.divContainer = {
      paddingLeft: '0px',
      paddingRight: '0px'
    };

    this.colHeight = {
      height: '40px'
    };
  }

  componentDidMount() {
    this.props.dispatch(formActions.initializeForm(this.formInstanceId, this.props.formId));

    if (this.props.encounter) {
      this.props.dispatch(formActions.loadFormBackingEncounter(this.formInstanceId, this.props.encounter.uuid));
    }
    else {
      this.props.dispatch(formActions.setFormState(this.formInstanceId, FORM_STATES.EDITING));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(formActions.destroyForm(this.formInstanceId));
  }

  enterEditMode() {
    this.props.dispatch(formActions.setFormState(this.formInstanceId, FORM_STATES.EDITING));
  }

  exitEditMode() {
    this.props.dispatch(formActions.setFormState(this.formInstanceId, FORM_STATES.VIEWING));
  }

  handleCancel() {
    this.exitEditMode();
    if (this.props.backLink) {
      this.props.dispatch(push(this.props.backLink));
    }
  }

  getForm() {
    return this.props.forms ? this.props.forms[this.formInstanceId] : null;
  }

  render() {

    return (
      <div style={this.divContainer}>
        <Grid style={this.divContainer}>
          <Row style={this.rowStyles}>
            <Col sm={20} md={20} style={this.littlePaddingLeft}>
              <span><h1>{this.props.title}</h1></span>
            </Col>
          </Row>
          <Row>
            <Col sm={20} md={20} style={this.colHeight}>
              <span><h1>{''}</h1></span>
            </Col>
          </Row>
        </Grid>

        {this.getForm() && (this.getForm().state === FORM_STATES.EDITING || this.getForm().state === FORM_STATES.VIEWING) ?
          (<div>
            <EncounterForm
              defaultValues={this.props.defaultValues}
              encounter={this.getForm().encounter}
              encounterType={this.props.encounterType}
              formId={this.props.formId}
              formInstanceId={this.formInstanceId}
              formSubmittedActionCreator={this.formSubmittedActionCreators}
              mode={this.getForm().state === FORM_STATES.EDITING ? 'edit' : 'view'}
              patient={this.props.patient}
              visit={this.props.patient ? this.props.patient.visit : null}
            >
              {this.props.formContent}
              <Grid>
                <Row>
                  <Col sm={2} xsOffset={2}>
                    {this.getForm().state === FORM_STATES.EDITING ?
                      (<Cancel onClick={this.handleCancel}/>)
                      : (null)
                    }
                  </Col>
                  <Col sm={2} xsOffset={1}>
                    {this.getForm().state === FORM_STATES.EDITING ?
                      (<Submit onClick={this.exitEditMode}/>) :
                      (<Button onClick={this.enterEditMode} bsSize="large">Edit</Button>)
                    }
                  </Col>
                </Row>
              </Grid>
            </EncounterForm>
          </div>)
          :
          (<Loader/>)
        }
      </div>
    );
  }
}

EncounterFormPage.propTypes = {
  afterSubmitLink: PropTypes.string,
  backLink: PropTypes.string,
  defaultValues: PropTypes.array,
  encounter: PropTypes.object,
  encounterType: PropTypes.object,
  formContent: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  formInstanceId: PropTypes.string,
  formSubmittedActionCreators: PropTypes.array,
  patient: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  visit: PropTypes.object
};

const mapStateToProps = (state, props) => {
  return {
    // if a patient is passed in, use that one, otherwise look in the store
    patient: props.patient ? props.patient : (state.openmrs.selectedPatient ? state.openmrs.patients[state.openmrs.selectedPatient] : null),
    forms: state.openmrs.form
  };
};

export default connect(mapStateToProps)(EncounterFormPage);
