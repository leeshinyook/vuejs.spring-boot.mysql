import Vue from 'vue'
import RegisterPage from '@/views/RegisterPage'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
// vm.$router에 접근할 수 있도록
// 테스트에 Vue Router 추가하기
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter();

// registrationService의 목
jest.mock('@/services/registration')


describe('RegisterPage.vue', () => {
  let wrapper
  let fieldUsername
  let fieldEmailAddress
  let filedPassword
  let buttonSubmit

  beforeEach(() => {
    wrapper = mount(RegisterPage, {
      localVue,
      router
    })
    fieldUsername = wrapper.find('#username')
    fieldEmailAddress = wrapper.find('#emailAddress')
    filedPassword = wrapper.find('#password')
    buttonSubmit = wrapper.find('form button[type=submit]')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  // 렌더링 테스트
  it('should render correct contents', () => {
    expect(wrapper.find('.logo').attributes().src)
      .toEqual('/static/images/logo.png')
    expect(wrapper.find('.tagline').text())
      .toEqual('Open source task management tool')
    expect(fieldUsername.element.value).toEqual('')
    expect(fieldEmailAddress.element.value).toEqual('')
    expect(filedPassword.element.value).toEqual('')
    expect(buttonSubmit.text()).toEqual('Create account')
  })
  // 데이터모델 초기값 테스트
  it('should contain data model with initial values', () => {
    expect(wrapper.vm.form.username).toEqual('')
    expect(wrapper.vm.form.emailAddress).toEqual('')
    expect(wrapper.vm.form.password).toEqual('')
  })
  // 폼의 입력과 데이터 모델의 바인딩을 검증하는 테스트
  it('should have form inputs bound with data model', () => {
    const username = 'sunny'
    const emailAddress = 'sunny@local'
    const password = 'VueJsRocks'

    wrapper.vm.form.username = username
    wrapper.vm.form.emailAddress = emailAddress
    wrapper.vm.form.password = password
    expect(fieldUsername.element.value).toEqual(username)
    expect(fieldEmailAddress.element.value).toEqual(emailAddress)
    expect(filedPassword.element.value).toEqual(password)
  })
  // 제출 핸들러 존재 여부 확인하는 테스트
  it('should have form submit event handler `submitForm`', () => {
    const stub = jest.fn()
    wrapper.setMethods({ submitForm: stub })
    buttonSubmit.trigger('submit')
    expect(stub).toBeCalled()
  })
  // 회원가입을 검증하는 테스트
  it('should register when it is a new user', () => {
    const stub = jest.fn();
    wrapper.vm.$router.push = stub
    wrapper.vm.form.username = 'sunny'
    wrapper.vm.form.emailAddress = 'sunny@local'
    wrapper.vm.form.password = 'Jest!'
    wrapper.vm.submitForm()
    wrapper.vm.$nextTick(() => {
      expect(stub).toHaveBeenCalledWith({ name: 'LoginPage' })
    })
  })
  // 회원가입 실패를 검증하는 테스트
  it('should fail it is not a new user', () => {
    // 목에서는 오직 sunny@local만 새로운 사용자이다.
    wrapper.vm.form.emailAddress = 'ted@local'
    expect(wrapper.find('.failed').isVisible()).toBe(false)
    wrapper.vm.submitForm()
    wrapper.vm.$nextTick(null, () => {
      expect(wrapper.find('failed').isVisible()).toBe(true)
    })
  })

})
