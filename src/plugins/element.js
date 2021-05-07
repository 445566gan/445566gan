import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Row,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Col,
    Table,
    TableColumn,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option
} from 'element-ui'
Vue.use(Option)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Col)
Vue.use(Card)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Container)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
