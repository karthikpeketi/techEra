import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Courses from '../Courses'

import Navbar from '../Navbar'

import './index.css'

const apiStatusCode = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
}

class Home extends Component {
  state = {
    coursesList: [],
    apiStatus: apiStatusCode.initial,
  }

  componentDidMount() {
    this.getCoursesList()
  }

  onRetryApiRequest = () => {
    this.getCoursesList()
  }

  formattingToCamelCase = courseArray => {
    const formattedData = courseArray.map(each => ({
      id: each.id,
      name: each.name,
      logoUrl: each.logo_url,
    }))
    return formattedData
  }

  onSuccess = finalCoursesArray => {
    this.setState({
      apiStatus: apiStatusCode.success,
      coursesList: finalCoursesArray,
    })
    console.log(finalCoursesArray)
  }

  onFailure = status => {
    this.setState({apiStatus: apiStatusCode.failure})
    console.log(status)
  }

  getCoursesList = async () => {
    this.setState({apiStatus: apiStatusCode.inprogress})
    const coursesApiUrl = 'https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
    }
    const response = await fetch(coursesApiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccess(this.formattingToCamelCase(data.courses))
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
    const {coursesList} = this.state
    return (
      <div className="courses-container">
        <h1 className="courses-heading">Courses</h1>
        <ul className="course-unordered-list">
          {coursesList.map(each => (
            <Courses courseDetails={each} key={each.id} />
          ))}
        </ul>
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
    return (
      <div className="home-container">
        <Navbar />
        <div>{this.renderApiStatus()}</div>
      </div>
    )
  }
}

export default Home
