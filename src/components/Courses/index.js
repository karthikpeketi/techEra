import {Link} from 'react-router-dom'

import './index.css'

const Courses = props => {
  const {courseDetails} = props
  const {id, name, logoUrl} = courseDetails

  return (
    <Link to={`/courses/${id}`}>
      <li className="course-container">
        <img src={logoUrl} alt="course_details" className="course-img" />
        <p className="course-name">{name}</p>
      </li>
    </Link>
  )
}

export default Courses
