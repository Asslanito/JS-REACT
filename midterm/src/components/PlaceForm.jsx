import { useEffect, useRef, useState } from 'react'
import { placesApi, validatePlace } from '../lib/api.js'
import { categories, cities, noiseLevels } from '../lib/constants.js'
import Icon from './Icon.jsx'

const initialValues = {
  name: '',
  category: 'Library',
  city: 'Almaty',
  district: '',
  address: '',
  noise: 'Quiet',
  price: '0',
  seats: '20',
  opens: '09:00',
  closes: '20:00',
  description: '',
  wifi: true,
  outlets: true,
}

function Field({ label, name, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      {children}
      {error && (
        <p className="field-error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function PlaceForm({ onCreated }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const controller = useRef(null)
  useEffect(() => () => controller.current?.abort(), [])
  function change(event) {
    const { name, value, type, checked } = event.target
    setValues((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
    setMessage('')
  }
  function inputProps(name) {
    return {
      id: name,
      name,
      value: values[name],
      onChange: change,
      'aria-invalid': !!errors[name],
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    }
  }
  async function submit(event) {
    event.preventDefault()
    if (
      controller.current &&
      !controller.current.signal.aborted &&
      status === 'loading'
    )
      return
    const validation = validatePlace(values)
    setErrors(validation)
    if (Object.keys(validation).length) {
      setMessage('Check the highlighted fields below.')
      return
    }
    controller.current = new AbortController()
    const signal = controller.current.signal
    setStatus('loading')
    setMessage('')
    try {
      const place = await placesApi.create(values, signal)
      if (!signal.aborted) {
        setStatus('success')
        onCreated(place)
      }
    } catch (error) {
      if (!signal.aborted) {
        setStatus('error')
        setMessage(error.message)
      }
    }
  }
  return (
    <section className="form-page">
      <a className="back-link" href="#/">
        <Icon name="back" size={18} />
        Back to exploring
      </a>
      <div className="form-layout">
        <div className="form-intro">
          <p className="eyebrow">GOOD PLACES ARE BETTER SHARED</p>
          <h1>
            Add a little
            <br />
            <em>change of scenery.</em>
          </h1>
          <p>
            A quiet library, your favorite café, a corner of campus. Make a
            little room for someone’s next big idea.
          </p>
          <div className="form-tip">
            <Icon name="atlas" size={25} />
            <h2>The details make the difference.</h2>
            <p>
              Add an address, atmosphere, and amenities so it’s easy to find the
              right fit.
            </p>
            <span>Added spots are saved on this browser.</span>
          </div>
        </div>
        <form className="place-form" onSubmit={submit} noValidate>
          <div className="form-title">
            <h2>Tell us about your spot</h2>
            <span>All text fields are required</span>
          </div>
          <fieldset disabled={status === 'loading'}>
            <Field label="Place name" name="name" error={errors.name}>
              <input
                {...inputProps('name')}
                placeholder="e.g. The Reading Room"
                maxLength={80}
                autoComplete="off"
              />
            </Field>
            <div className="form-row">
              <Field
                label="Type of place"
                name="category"
                error={errors.category}
              >
                <select {...inputProps('category')}>
                  {categories.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </Field>
              <Field label="City" name="city" error={errors.city}>
                <select {...inputProps('city')}>
                  {cities.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="form-row">
              <Field
                label="Neighborhood / district"
                name="district"
                error={errors.district}
              >
                <input
                  {...inputProps('district')}
                  placeholder="e.g. Bostandyk"
                  maxLength={60}
                />
              </Field>
              <Field label="Atmosphere" name="noise" error={errors.noise}>
                <select {...inputProps('noise')}>
                  {noiseLevels.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Street address" name="address" error={errors.address}>
              <input
                {...inputProps('address')}
                placeholder="Street and building number"
                maxLength={120}
                autoComplete="street-address"
              />
            </Field>
            <div className="form-row">
              <Field label="Entry price (₸)" name="price" error={errors.price}>
                <input
                  {...inputProps('price')}
                  type="number"
                  min="0"
                  max="50000"
                  step="1"
                />
              </Field>
              <Field label="Number of seats" name="seats" error={errors.seats}>
                <input
                  {...inputProps('seats')}
                  type="number"
                  min="1"
                  max="500"
                  step="1"
                />
              </Field>
            </div>
            <div className="form-row">
              <Field label="Opens daily at" name="opens" error={errors.opens}>
                <input {...inputProps('opens')} type="time" />
              </Field>
              <Field
                label="Closes daily at"
                name="closes"
                error={errors.closes}
              >
                <input {...inputProps('closes')} type="time" />
              </Field>
            </div>
            <Field
              label="What makes it a good study spot?"
              name="description"
              error={errors.description}
            >
              <textarea
                {...inputProps('description')}
                rows={4}
                maxLength={600}
                placeholder="Tell us about the light, the seating, or your favorite thing about this place…"
              />
              <span className="character-count">
                {values.description.length}/600 · at least 20 characters
              </span>
            </Field>
            <div className="form-amenities">
              <label>
                <input
                  type="checkbox"
                  name="wifi"
                  checked={values.wifi}
                  onChange={change}
                />
                <Icon name="wifi" size={17} />
                Wi-Fi available
              </label>
              <label>
                <input
                  type="checkbox"
                  name="outlets"
                  checked={values.outlets}
                  onChange={change}
                />
                <Icon name="plug" size={17} />
                Power outlets
              </label>
            </div>
          </fieldset>
          {message && (
            <p className="form-error" role="alert">
              {message}
            </p>
          )}
          <div className="form-actions">
            <a className="text-button" href="#/">
              Cancel
            </a>
            <button
              className="button primary"
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <span className="spinner" />
                  Saving your spot…
                </>
              ) : (
                <>
                  Add to the atlas
                  <Icon name="plus" size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
