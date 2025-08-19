import { mount } from "@vue/test-utils";
import HelloWorld from "./HelloWorld.vue";

test("renders props.msg", () => {
  const wrapper = mount(HelloWorld, { props: { msg: "Hello Vue" } });
  expect(wrapper.text()).toContain("Hello Vue");
});
