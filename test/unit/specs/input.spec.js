import { createVue, destroyVM } from '../util';

describe('Input', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createVue({
      template: `
        <el-input
          :minlength="3"
          :maxlength="5"
          placeholder="请输入内容"
          @focus="handleFocus"
          value="input">
        </el-input>
      `,
      data() {
        return {
          inputFocus: false
        };
      },
      methods: {
        handleFocus() {
          this.inputFocus = true;
        }
      }
    }, true);
    let inputElm = vm.$el.querySelector('input');
    inputElm.focus();
    expect(vm.inputFocus).to.be.true;
    expect(inputElm.getAttribute('placeholder')).to.equal('请输入内容');
    expect(inputElm.value).to.equal('input');
    expect(inputElm.getAttribute('minlength')).to.equal('3');
    expect(inputElm.getAttribute('maxlength')).to.equal('5');
  });

  it('disabled', () => {
    vm = createVue({
      template: `
        <el-input disabled>
        </el-input>
      `
    }, true);
    expect(vm.$el.querySelector('input').getAttribute('disabled')).to.ok;
  });

  it('icon', () => {
    vm = createVue({
      template: `
        <el-input
          icon="time"
          @click="handleIconClick"
        >
        </el-input>
      `,
      data() {
        return {
          iconClicked: false
        };
      },
      methods: {
        handleIconClick(ev) {
          this.iconClicked = true;
        }
      }
    }, true);
    var icon = vm.$el.querySelector('.el-input__icon');
    icon.click();
    expect(icon.classList.contains('el-icon-time')).to.true;
    expect(vm.iconClicked).to.true;
  });

  it('size', () => {
    vm = createVue({
      template: `
        <el-input size="large">
        </el-input>
      `
    }, true);

    expect(vm.$el.classList.contains('el-input--large')).to.true;
  });

  it('type', () => {
    vm = createVue({
      template: `
        <el-input type="textarea">
        </el-input>
      `
    }, true);

    expect(vm.$el.classList.contains('el-textarea')).to.true;
  });

  it('rows', () => {
    vm = createVue({
      template: `
        <el-input type="textarea" :rows="3">
        </el-input>
      `
    }, true);
    expect(vm.$el.querySelector('.el-textarea__inner').getAttribute('rows')).to.be.equal('3');
  });

  it('autosize', done => {
    vm = createVue({
      template: `
        <div>
          <el-input
            ref="limitSize"
            type="textarea"
            :autosize="{minRows: 3, maxRows: 5}"
            v-model="textareaValue"
          >
          </el-input>
          <el-input
            ref="limitlessSize"
            type="textarea"
            autosize
            v-model="textareaValue"
          >
          </el-input>
        </div>
      `,
      data() {
        return {
          textareaValue: 'sda\ndasd\nddasdsda\ndasd\nddasdsda\ndasd\nddasdsda\ndasd\nddasd'
        };
      }
    }, true);

    var limitSizeInput = vm.$refs.limitSize;
    var limitlessSizeInput = vm.$refs.limitlessSize;
    expect(limitSizeInput.textareaStyle.height).to.be.equal('117px');
    expect(limitlessSizeInput.textareaStyle.height).to.be.equal('201px');

    vm.textareaValue = '';
    setTimeout(_ => {
      expect(limitSizeInput.textareaStyle.height).to.be.equal('75px');
      expect(limitlessSizeInput.textareaStyle.height).to.be.equal('33px');
      done();
    }, 200);
  });

  describe('Input Events', () => {
    it('event:focus & blur', done => {
      vm = createVue({
        template: `
          <el-input
            ref="input"
            placeholder="请输入内容"
            value="input">
          </el-input>
        `
      }, true);

      const spyFocus = sinon.spy();
      const spyBlur = sinon.spy();

      vm.$refs.input.$on('focus', spyFocus);
      vm.$refs.input.$on('blur', spyBlur);
      vm.$el.querySelector('input').focus();
      vm.$el.querySelector('input').blur();

      vm.$nextTick(_ => {
        expect(spyFocus.calledOnce).to.be.true;
        expect(spyBlur.calledOnce).to.be.true;
        done();
      });
    });
    it('event:change', done => {
      vm = createVue({
        template: `
          <el-input
            ref="input"
            placeholder="请输入内容"
            :value="input">
          </el-input>
        `,
        data() {
          return {
            input: 'a'
          };
        }
      }, true);

      const spy = sinon.spy();
      vm.$refs.input.$on('change', spy);
      vm.input = 'b';

      vm.$nextTick(_ => {
        expect(spy.withArgs('b').calledOnce).to.be.true;
        done();
      });
    });
  });
});
