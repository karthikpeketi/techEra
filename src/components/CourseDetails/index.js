import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Navbar from '../Navbar'

import './index.css'

const apiStatusCode = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
}

class CourseDetails extends Component {
  state = {
    apiStatus: apiStatusCode.initial,
    courseDetails: {},
  }

  componentDidMount() {
    this.getCourseDetailsApi()
  }

  onRetryApiRequest = () => {
    this.getCourseDetailsApi()
  }

  //   formattingToCamelCase = courseDetailsObj => {
  //     const formattedData = {
  //       id: courseDetailsObj.id,
  //       name: courseDetailsObj.name,
  //       imageUrl: courseDetailsObj.image_url,
  //       description: courseDetailsObj.description,
  //     }
  //     return formattedData
  //   }

  onSuccess = finalCoursesArray => {
    this.setState({
      apiStatus: apiStatusCode.success,
      courseDetails: finalCoursesArray,
    })
    console.log(finalCoursesArray)
  }

  onFailure = status => {
    this.setState({apiStatus: apiStatusCode.failure})
    console.log(status)
  }

  getCourseDetailsApi = async () => {
    this.setState({apiStatus: apiStatusCode.inprogress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const courseDetailsApiUrl = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(courseDetailsApiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccess(data.course_details)
      //   this.onSuccess(this.formattingToCamelCase(data))
    } else if (response.ok === false) {
      this.onFailure(response.status)
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>

      <button
        onClick={this.onRetryApiRequest}
        type="button"
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {courseDetails} = this.state
    return (
      <div className="course-details-main-container">
        <div className="course-details-container">
          <img
            src={courseDetails.image_url}
            alt="name"
            className="course-lg-logo"
          />
          <div className="about-course-container">
            <h1>{courseDetails.name}</h1>
            <p>{courseDetails.description}</p>
          </div>
        </div>
      </div>
    )
  }

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusCode.success:
        return this.renderSuccessView()
      case apiStatusCode.failure:
        return this.renderFailureView()
      case apiStatusCode.inprogress:
        return this.renderLoadingView()
      case apiStatusCode.initial:
        return null
      default:
        return null
    }
  }

  render() {
    const {courseDetails} = this.state
    console.log(courseDetails)
    return (
      <div className="course-details-main-container">
        <Navbar />
        <div className="course-details-container">{this.renderApiStatus()}</div>
      </div>
    )
  }
}

export default CourseDetails
