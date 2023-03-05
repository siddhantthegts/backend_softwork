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
  trade: String,
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
  fromDate: Date,
  toDate: Date,
  regularTime: String,
  shiftTime: String,
  overTime: String,
  doubleTime: String,
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
      toDate: req.body.toDate,
      fromDate: req.body.fromDate,
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
  } else if (req.method === 'GET') {
    const wageData = [];
    const WageModel = mongoose.model('Wages', wage);
    const func = async () => {
      await WageModel.find({}).then((r) => {
        for (let i = 0; i < r.length; i++) {
          wageData.push(r[i]);
        }
      });
      res.send(wageData);
    };
    func();
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
        for (let i = 0; i < r.length; i++) {
          data.push(r[i]);
        }
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
      res.json(tradeData);
    };
    func();
  }
});

app.get('/classificationonly', (req, res) => {
  const data = [];
  mongoose.connect(client);
  const classi = mongoose.model('Classification', classification);
  classi
    .find({}, { _id: 1, classificationType: 1, unionAffiliation: 1 })
    .then((r) => {
      res.send(r);
    });
});

app.get('/employeesonly', (req, res) => {
  mongoose.connect(client);
  const employeeonly = mongoose.model('Users', user);
  employeeonly
    .find({}, { _id: 1, firstName: 1, lastName: 1, employeeType: 1 })
    .then((r) => {
      res.send(r);
    });
});

app.get('/contractorsonly', (req, res) => {
  mongoose.connect(client);
  const contractor = mongoose.model('Contractors', contractors);
  contractor
    .find(
      {},
      { _id: 1, contractorName: 1, contractorTrade: 1, contractorType: 1 }
    )
    .then((r) => {
      res.send(r);
    });
});

app.get('/projectsonly', (req, res) => {
  mongoose.connect(client);
  const projectsonly = mongoose.model('Projects', projects);
  projectsonly.find({}, { _id: 1, name: 1, code: 1 }).then((r) => {
    res.send(r);
  });
});

app.get('/tradeonly', (req, res) => {
  mongoose.connect(client);
  const TradeModel = mongoose.model('Trade', trade);

  TradeModel.find({}, { _id: 0, trade: 1 }).then((r) => {
    res.send(r);
  });
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
  } else if (req.method === 'GET') {
    const employeeData = [];
    const UserModel = mongoose.model('User', user);
    const func = async () => {
      await UserModel.find({}).then((r) => {
        for (let i = 0; i < r.length; i++) {
          employeeData.push(r[i]);
        }
      });
      res.json(employeeData);
    };
    func();
  }
});

app.get('/delete/projects', (req, res) => {
  mongoose.connect(client);
  const projectModel = mongoose.model('Project', projects);
  projectModel.deleteOne({ _id: req.query.id }).then(() => {
    res.send('Deleted ' + req.query.id);
  });
});
app.get('/delete/contractors', (req, res) => {
  mongoose.connect(client);
  const contractorModel = mongoose.model('Contractors', contractors);
  contractorModel.deleteOne({ _id: req.query.id }).then(() => {
    res.send('Deleted ' + req.query.id);
  });
});
app.get('/delete/classification', (req, res) => {
  mongoose.connect(client);
  const classificationModel = mongoose.model('Classification', classification);
  classificationModel.deleteOne({ _id: req.query.id }).then(() => {
    res.send('Deleted ' + req.query.id);
  });
});
app.get('/delete/employees', (req, res) => {
  mongoose.connect(client);
  const employeeModel = mongoose.model('User', user);
  employeeModel.deleteOne({ _id: req.query.id }).then(() => {
    res.send('Deleted ' + req.query.id);
  });
});
app.get('/delete/wages', (req, res) => {
  mongoose.connect(client);
  const wageModel = mongoose.model('Wage', wage);
  wageModel.deleteOne({ _id: req.query.id }).then(() => {
    res.send('Deleted ' + req.query.id);
  });
});

app.post('/update/projects', (req, res) => {
  mongoose.connect(client);
  const projectModel = mongoose.model('Project', projects);
  projectModel
    .updateOne({ _id: req.query.id }, [
      {
        $set: {
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
        },
      },
    ])
    .then(() => {
      res.send('Updated ' + req.query.id);
    });
});
app.post('/update/contractors', (req, res) => {
  mongoose.connect(client);
  const contractorModel = mongoose.model('Contractors', contractors);
  contractorModel
    .updateOne({ _id: req.query.id }, [
      {
        $set: {
          contractorName: req.body.contractorname,
          contractorAddress: req.body.contractoraddress,
          contractorType: req.body.contractortype,
          contractorTrade: req.body.contractortrade,
          assignedProject: req.body.assignedproject,
          cpi: req.body.cpi,
        },
      },
    ])
    .then(() => {
      res.send('Updated ' + req.query.id);
    });
});
app.get('/update/classification', (req, res) => {
  mongoose.connect(client);
  const classificationModel = mongoose.model('Classification', classification);
  classificationModel.deleteOne({ _id: req.query.id }).then(() => {
    res.send('Deleted ' + req.query.id);
  });
});
app.get('/update/employees', (req, res) => {
  mongoose.connect(client);
  const employeeModel = mongoose.model('User', user);
  employeeModel.deleteOne({ _id: req.query.id }).then(() => {
    res.send('Deleted ' + req.query.id);
  });
});
app.get('/update/wages', (req, res) => {
  mongoose.connect(client);
  const wageModel = mongoose.model('Wage', wage);
  wageModel.deleteOne({ _id: req.query.id }).then(() => {
    res.send('Deleted ' + req.query.id);
  });
});

app.listen(cfg.port, () => {
  console.log(`Example app listening at http://localhost:${cfg.port}`);
});

export { cfg, app };
