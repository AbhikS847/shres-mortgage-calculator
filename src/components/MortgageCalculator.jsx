import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Stepper, Step, StepLabel, Box, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Alert, Snackbar, Avatar, Dialog
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PercentIcon from '@mui/icons-material/Percent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const steps = ['Loan Details', 'Additional Costs', 'Review & Calculate'];

function MortgageCalculator() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [propertyTax, setPropertyTax] = useState('');
  const [homeInsurance, setHomeInsurance] = useState('');
  const [pmi, setPmi] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [error, setError] = useState('');

  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
  const [infoSnackbarMessage, setInfoSnackbarMessage] = useState('');
  const [infoSnackbarExplanation, setInfoSnackbarExplanation] = useState('');
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        setLoading(true); // Start loading spinner
        handleInfoSnackbarOpen(); // Open info snackbar with loading message
        calculateMortgage();
        setLoadingDialogOpen(true); // Open loading dialog
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
    // Reset Snackbar state when moving to the next step or calculating
    setInfoSnackbarOpen(false);
    setInfoSnackbarMessage('');
    setInfoSnackbarExplanation('');
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!loanAmount || loanAmount <= 0 || !interestRate || interestRate <= 0 || !loanTerm || loanTerm <= 0) {
          setError('Please enter valid values for Loan Amount, Interest Rate, and Loan Term.');
          return false;
        }
        break;
      case 1:
        if (downPayment < 0 || propertyTax < 0 || homeInsurance < 0 || pmi < 0) {
          setError('Please enter valid values for Down Payment, Property Tax, Home Insurance, and PMI.');
          return false;
        }
        break;
      default:
        setError('');
        break;
    }
    setError('');
    return true;
  };

  const calculateMortgage = () => {
    setLoadingDialogOpen(true); // Open the loading dialog
    setTimeout(() => {
      const principal = loanAmount - downPayment;
      const monthlyInterestRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      const monthlyPrincipalAndInterest = (principal * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

      const monthlyPropertyTax = (propertyTax / 100 * loanAmount) / 12;
      const monthlyHomeInsurance = homeInsurance / 12;
      const monthlyPMI = pmi;

      const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI;
      const totalInterestPaid = (totalMonthlyPayment * numberOfPayments) - principal;

      setMonthlyPayment(totalMonthlyPayment.toFixed(2));
      setTotalInterest(totalInterestPaid.toFixed(2));

      const schedule = [];
      let remainingBalance = principal;
      for (let i = 0; i < numberOfPayments; i++) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = monthlyPrincipalAndInterest - interestPayment;
        remainingBalance -= principalPayment;
        schedule.push({
          month: i + 1,
          interestPayment: interestPayment.toFixed(2),
          principalPayment: principalPayment.toFixed(2),
          remainingBalance: remainingBalance.toFixed(2),
        });
      }

      setAmortizationSchedule(schedule);
      setLoading(false); // Stop loading spinner
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

          // Reset all input fields
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setDownPayment('');
    setPropertyTax('');
    setHomeInsurance('');
    setPmi('');
    setError('');
    setLoadingDialogOpen(false); // Close loading dialog    
    }, 2000); // Simulate loading time
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6">Loan Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Loan Amount ($)"
                  variant="outlined"
                  fullWidth
                  value={loanAmount}
                  onClick={(e) => handleInfoClick(e, 'Loan Amount', 'Enter the total amount of the loan you are applying for.', 'Provided by: Lender, at the beginning of the loan application process.', 'This is the total amount of money you intend to borrow from the lender.')}
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value) || '')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Annual Interest Rate (%)"
                  variant="outlined"
                  fullWidth
                  value={interestRate}
                  onClick={(e) => handleInfoClick(e, 'Annual Interest Rate', 'Enter the annual interest rate for the loan.', 'Provided by: Lender, at the beginning of the loan application process.', 'This is the annual interest rate charged by the lender for borrowing the loan amount.')}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || '')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Loan Term (years)"
                  variant="outlined"
                  fullWidth
                  value={loanTerm}
                  onClick={(e) => handleInfoClick(e, 'Loan Term', 'Enter the duration of the loan in years.', 'Provided by: Lender, at the beginning of the loan application process.', 'This is the number of years over which you will repay the loan amount.')}
                  onChange={(e) => setLoanTerm(parseFloat(e.target.value) || '')}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6">Additional Costs</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Down Payment ($)"
                  variant="outlined"
                  fullWidth
                  value={downPayment}
                  onClick={(e) => handleInfoClick(e, 'Down Payment', 'Enter the amount of down payment you plan to make.', 'Provided by: Borrower, during the loan application process.', 'This is the initial payment made by the borrower toward the purchase price of the property, not covered by the mortgage loan.')}
                  onChange={(e) => setDownPayment(parseFloat(e.target.value) || '')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Annual Property Tax (%)"
                  variant="outlined"
                  fullWidth
                  value={propertyTax}
                  onClick={(e) => handleInfoClick(e, 'Annual Property Tax', 'Enter the annual property tax rate as a percentage.', 'Provided by: Local tax authority, based on property value and tax rate.', 'This is the annual tax levied by the local government on the assessed value of the property.')}
                  onChange={(e) => setPropertyTax(parseFloat(e.target.value) || '')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Annual Home Insurance ($)"
                  variant="outlined"
                  fullWidth
                  value={homeInsurance}
                  onClick={(e) => handleInfoClick(e, 'Annual Home Insurance', 'Enter the annual cost of home insurance.', 'Provided by: Insurance company, based on property value and coverage options chosen.', 'This is the annual cost of insurance coverage to protect the property against loss or damage.')}
                  onChange={(e) => setHomeInsurance(parseFloat(e.target.value) || '')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Monthly PMI ($)"
                  variant="outlined"
                  fullWidth
                  value={pmi}
                  onClick={(e) => handleInfoClick(e, 'Monthly PMI', 'Enter the monthly private mortgage insurance (PMI) amount.', 'Provided by: Lender, for loans with down payments less than 20% of the property value.', 'This is the monthly insurance premium paid by the borrower to protect the lender against default on the loan.')}
                  onChange={(e) => setPmi(parseFloat(e.target.value) || '')}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box padding='16px' color="#000">
            <Typography variant="h6">Review & Calculate</Typography>
            <Grid container spacing ={2} padding={2} marginTop={1}>
              <Grid item xs={4}>
                <AccountBalanceIcon fontSize='large' style={{color:'red'}}></AccountBalanceIcon>
                <Typography>Loan Amount:</Typography>
                <div><strong> ${loanAmount}</strong></div>
              </Grid>
              <Grid item xs={4}>
                <PercentIcon fontSize='large' style={{color:'red'}}></PercentIcon>
                <Typography>Annual Interest Rate:</Typography>
                <div><strong>{interestRate}%</strong></div>
              </Grid>
              <Grid item xs={4}>
                <AccessTimeIcon fontSize='large' style={{color:'red'}}></AccessTimeIcon>
                <Typography>Loan Term:</Typography>
                <div><strong>{loanTerm} years</strong></div>
              </Grid>
            </Grid>
            <Grid container spacing ={2} padding={2}>
            <Grid item xs={4}>
      <PaymentIcon fontSize='large' style={{color:'red'}} />
      <Typography>Down Payment:</Typography>
      <div><strong>${downPayment}</strong></div>
    </Grid>
    <Grid item xs={4}>
      <HomeIcon fontSize='large' style={{color:'red'}} />
      <Typography>Annual Property Tax:</Typography>
      <div><strong>{propertyTax}%</strong></div>
    </Grid>
    <Grid item xs={4}>
      <IndeterminateCheckBoxIcon fontSize='large' style={{color:'red'}} />
      <Typography>Annual Home Insurance:</Typography>
      <div><strong>${homeInsurance}</strong></div>
    </Grid>
    <Grid item xs={4}>
      <CalendarMonthIcon fontSize='large' style={{color:'red'}} />
      <Typography>Monthly PMI:</Typography>
      <div><strong>${pmi}</strong></div>
    </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleInfoClick = (event, label, message, provider, explanation) => {
    setInfoSnackbarMessage(message);
    setInfoSnackbarExplanation(explanation);
    setInfoSnackbarOpen(true);
  };

  const handleInfoSnackbarOpen = () => {
    setInfoSnackbarMessage('Calculating Mortgage...');
    setInfoSnackbarExplanation('Please wait while we calculate your mortgage details.');
    setInfoSnackbarOpen(true);
  };

  const handleInfoSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setInfoSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      {/* Snackbar for Mobile */}
      <Snackbar
        open={infoSnackbarOpen}
        onClose={handleInfoSnackbarClose}
        message={
          <Box display="flex" alignItems="center">
            {loading && <CircularProgress size={24} sx={{ marginRight: '8px' }} />}
            <Box>
              <Typography variant="body1" fontWeight="bold">{infoSnackbarMessage}</Typography>
              <Typography variant="body2">{infoSnackbarExplanation}</Typography>
            </Box>
          </Box>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            backgroundColor: 'white',
            borderTop: '4px solid #e57373',
            color: 'black',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '600px',
            textAlign: 'left',
            lineHeight: '1.4',
            padding: '12px',
          }
        }}
      />
        <Dialog
  open={loadingDialogOpen}
  aria-labelledby="loading-dialog-title"
  PaperProps={{
    style: {
      backgroundColor: 'white',
      padding: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }}
>
  <CircularProgress />
  <strong>Calculating your mortgage....</strong>
</Dialog>
      {/* House icon and title */}
      <Box display="flex" alignItems="center" marginBottom="20px">
        <Avatar sx={{ bgcolor: 'red', marginRight: '10px', marginBottom: '8px' }}>
          <HomeIcon />
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom style={{ color: 'red' }}>
         Mortgage Mate
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Error message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Content based on active step */}
      {activeStep === steps.length ? (
        <Box>
          <Box>
            <div style={{ backgroundColor: 'red', padding: 16, margin: 8, borderRadius: '15px' }}>
              <Typography variant="h5" component="h2" gutterBottom>Results</Typography>
              <Grid container={2}>
              <Grid item xs={6}>
      <AttachMoneyIcon fontSize='large' style={{ color: '#fff' }} />
      <Typography>Estimated Monthly Payment:</Typography>
      <div><strong>${monthlyPayment}</strong></div>
    </Grid>
    <Grid item xs={6}>
      <MonetizationOnIcon fontSize='large' style={{ color: '#fff' }} />
      <Typography>Total Interest Paid:</Typography>
      <div><strong>${totalInterest}</strong></div>
    </Grid>
    </Grid>
            </div>
            <Typography variant="h6" component="h3" gutterBottom color='#000' fontWeight='600'>Amortization Schedule</Typography>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Principal Payment ($)</TableCell>
                    <TableCell>Interest Payment ($)</TableCell>
                    <TableCell>Remaining Balance ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {amortizationSchedule.map((payment) => (
                    <TableRow key={payment.month}>
                      <TableCell>{payment.month}</TableCell>
                      <TableCell>{payment.principalPayment}</TableCell>
                      <TableCell>{payment.interestPayment}</TableCell>
                      <TableCell>{payment.remainingBalance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Button onClick={() => setActiveStep(0)} style={{ marginTop: '20px' }}>
              Reset
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          {renderStepContent(activeStep)}
          <Box display="flex" justifyContent="flex-end" marginTop="20px">
            <Button disabled={activeStep === 0} onClick={handleBack} style={{ marginRight: '10px' }}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Calculate' : 'Next'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default MortgageCalculator;