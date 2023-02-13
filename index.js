import express, { urlencoded } from 'express';
import { fileURLToPath } from 'url';
import { dirname, sep } from 'path';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
const __dirname = dirname(fileURLToPath(import.meta.url)) + sep;

const client =
  'mongodb+srv://admin:admin123@cluster0.rizqca1.mongodb.net/?retryWrites=true&w=majority';
const cfg = {
  port: process.env.PORT || 9000,
};

const app = express();

app.use(compression());
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
const { Schema } = mongoose;

const contractors = new Schema({
  contractorType: String,
  contractorTrade: String,
  contractorName: String,
  address: String,
  phone: String,
  cpi: {
    type: Array,
  },
  assignedProjects: Array,
});

const projects = new Schema({
  code: String,
  name: String,
  address: String,
  ntpDate: String,
  scDate: String,
  awardDate: String,
  description: String,
  fcDate: String,
  primeContractors: Array,
  subContractors: Array,
  assignedProjectManager: Array,
  assignedProjectSupervisor: Array,
});
const user = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
  },
  phoneNumber: String,
  employeeType: String,
  compnayName: String,
  address: String,
  phone: String,
  email: String,
  dob: Date,
  gender: String,
  date: { type: Date, default: Date.now },
  emergencyContact: Array,
  companyAddress: [
    {
      address1: String,
      address2: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
    },
  ],
  employeeCertification: Array,
  employee: [
    {
      employeeCertification: [
        {
          certificationTitle: String,
          issuanceDate: Date,
          expirationDate: Date,
          ceritificate: String,
        },
      ],
    },
  ],
});

const trade = new Schema({
  trade: Array,
  date: {
    type: Date,
    default: Date.now,
  },
});

const classification = new Schema({
  unionAffiliation: {
    default: 'NA',
    type: String,
  },
  classificationType: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const wage = new Schema({
  trade: String,
  classificationType: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

app.all('/', (req, res, next) => {
  // mongoose.connect(client);
  // const Cat = mongoose.model('Cat', { name: String });
  // const kitty = new Cat({ name: 'Zildjian' });
  // kitty.save().then(() => console.log('meow'));
  if (req.method === 'GET' || req.method === 'POST') {
    res.json(req.body.firstName);
  } else {
    next();
  }
});

app.all('/wages', (req, res) => {
  mongoose.connect(client);
  if (req.method === 'POST') {
    console.log(req.body);
    const WageModel = mongoose.model('Wage', wage);
    const addWage = new WageModel({
      classificationType: req.body.classificationType,
      trade: req.body.trade,
      regularTime: req.body.regularTime,
      doubleTime: req.body.doubleTime,
      overTime: req.body.overTime,
      date: new Date(),
    });
    addWage.save().then(() => {
      console.log(
        req.body.trade +
          ' ' +
          req.body.classificationType +
          ' saved Successfully'
      );
      res.send('Saved Successfully!!!');
    });
  }
});

app.all('/contractors', (req, res) => {
  mongoose.connect(client);
  const ContractorModel = mongoose.model('Contractor', contractors);
  if (req.method === 'POST') {
    const addContractor = new ContractorModel({
      contractorName: req.body.contractorname,
      contractorAddress: req.body.contractoraddress,
      contractorType: req.body.contractortype,
      contractorTrade: req.body.contractortrade,
      assignedProject: req.body.assignedproject,
      cpi: {
        name: req.body.cpi.name,
        title: req.body.cpi.title,
        phone: req.body.cpi.phone,
        email: req.body.cpi.email,
      },
    });
    addContractor.save().then(() => {
      console.log(req.body + ' saved succesfully');
    });
  } else if (req.method === 'GET') {
    const contracdata = [];
    const ContractorModal = mongoose.model('Contractor', contractors);
    const func = async () => {
      await ContractorModal.find({}).then((r) => {
        for (let i = 0; i < r.length; i++) {
          contracdata.push(r[i]);
        }
      });
      res.send(contracdata);
    };
    func();
  }
});

app.all('/classification', (req, res) => {
  mongoose.connect(client);
  const ClassificationModel = mongoose.model('Classification', classification);
  if (req.method === 'POST') {
    const addClassification = new ClassificationModel({
      unionAffiliation: req.body.unionAffiliation,
      classificationType: req.body.classificationType,
    });
    addClassification.save().then(() => {
      console.log(
        req.body.classificationType +
          ' ' +
          req.body.unionAffiliation +
          ' saved Successfully!!'
      );
    });
  }
  if (req.method === 'GET') {
    const data = [];
    const func = async () => {
      await ClassificationModel.find({}).then((r) => {
        r.map((i) => data.push(i.classificationType));
      });
      res.send(data);
    };
    func();
  }
});

app.all('/projects', (req, res) => {
  mongoose.connect(client);
  if (req.method === 'POST') {
    const project = mongoose.model('Project', projects);
    const addProject = new project({
      code: req.body.code,
      name: req.body.name,
      address: req.body.address,
      description: req.body.description,
      ntpDate: req.body.ntpDate,
      scDate: req.body.scDate,
      fcDate: req.body.fcDate,
      awardDate: req.body.awardDate,
      primeContractors: req.body.primeContractors,
      subContractors: req.body.subContractors,
      assignedProjectManager: req.body.assignedProjectManager,
      assignedProjectSupervisor: req.body.assignedProjectSupervisor,
    });
    addProject.save().then(() => {
      console.log(req.body + ' added successfully!!');
    });
  } else if (req.method === 'GET') {
    const projectData = [];
    const ProjectModal = mongoose.model('Project', projects);
    const func = async () => {
      await ProjectModal.find({}).then((r) => {
        for (let i = 0; i < r.length; i++) {
          const arr = r[i];
          projectData.push(r[i]);
        }
      });
      res.send(projectData);
    };
    func();
  }
});

app.all('/trade', (req, res) => {
  mongoose.connect(client);
  if (req.method === 'POST') {
    const TradeModel = mongoose.model('Trade', trade);
    const addTrade = new TradeModel({
      trade: req.body.trade,
    });
    addTrade.save().then(() => {
      console.log(req.body.trade + ' saved Successfully!!');
    });
  }
  if (req.method === 'GET') {
    const tradeData = [];
    const TradeModel = mongoose.model('Trade', trade);
    const func = async () => {
      await TradeModel.find({}).then((r) => {
        for (let i = 0; i < r.length; i++) {
          const arr = r[i].trade;
          arr.map((i) => {
            tradeData.push(i);
          });
        }
      });
      res.send(tradeData);
    };
    func();
  }
});

app.all('/employees', (req, res, next) => {
  if (req.method === 'POST') {
    mongoose.connect(client);
    const UserModel = mongoose.model('User', user);

    // if (req.body.selectedOption === 'Admin') {
    const addUser = new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      employeeType: req.body.employeeType,
      address: req.body.address,
      dob: req.body.dob,
      gender: req.body.gender,
      emergencyContact: req.body.emergencyContact,
      employeeCertification: req.body.employeeCertification,
      phoneNumber: req.body.phoneNumber,
      compnayName: req.body.compnayName ? req.body.compnayName : '',
      companyAddress: req.body.array,
    });
    addUser.save().then(() => {
      res.send('Successfully Saved to Database!!');
      console.log(
        req.body.firstName + ' ' + req.body.lastName + ' saved Successfully!!'
      );
      console.log(req.body);
    });
    // }
    // else {
    //   const addUser = new UserModel({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email,
    //     employeeType: req.body.selectedOption,
    //     phoneNumber: req.body.phoneNumber,
    //     compnayName: req.body.compnayName ? req.body.compnayName : '',
    //     employeeDetail: req.body.employeeDetail,
    //   });
    //   addUser.save().then(() => {
    //     console.log(
    //       req.body.firstName + ' ' + req.body.lastName + ' saved Successfully!!'
    //     );
    //     console.log(req.body);
    //   });
    // }
  } else {
    next();
  }
});

app.listen(cfg.port, () => {
  console.log(`Example app listening at http://localhost:${cfg.port}`);
});

export { cfg, app };
