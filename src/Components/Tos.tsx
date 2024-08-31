function Tos({ closeModal }: { closeModal: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>X</button>
        <div className="scrollable-content">
          <h1>Health Tracker - Terms of Service</h1>
          <p><strong>Effective Date:</strong> August 30, 2024</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Health Tracker, an open-source application designed to help users track health symptoms, illnesses, and diseases.
              By accessing or using the Health Tracker app (the "App"), you agree to comply with and be bound by these Terms of Service ("Terms").
              If you do not agree to these Terms, you will not have full access to the App.
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>
              The Health Tracker app is intended for users who are 18 years of age or older.
              By using this App, you represent and warrant that you meet this eligibility requirement.
              The App is available for use globally, and it is your responsibility to ensure that your use of the App complies with the laws of your jurisdiction.
            </p>
          </section>

          <section>
            <h2>3. Account Creation</h2>
            <p>
              To use the App, you must create an account by providing your email address, creating a password, and entering your first and last name.
              You are responsible for maintaining the confidentiality of your account information and are fully responsible for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2>4. Data Collection and Privacy</h2>
            <p>
              The App collects and stores health-related information, including your primary health concern (e.g., a core symptom, illness, or disease) and associated symptoms.
              This data is encrypted and securely stored in an AWS RDS MySQL database. Communication between the server and the database is protected using SSL encryption.
            </p>
            <p>
              <strong>HIPAA Compliance:</strong> I have taken steps to comply with HIPAA regulations to the best of my ability, including signing a Business Associate Agreement (BAA) with AWS.
              However, please be aware that this app is an open-source project developed by a self-taught programmer, and there may be unforeseen issues or gaps in compliance.
            </p>
            <p>
              <strong>Data Sharing:</strong> Your data is not shared with any third parties and will not be shared in the future.
            </p>
          </section>

          <section>
            <h2>5. User Responsibilities</h2>
            <p>By using the App, you agree to:</p>
            <ul>
              <li>Provide accurate and up-to-date information.</li>
              <li>
                Refrain from engaging in prohibited activities, including but not limited to attempting to hack or disrupt the App, unless you are a security researcher who has communicated with me about identifying vulnerabilities.
              </li>
              <li>
                Understand that the App is developed by a self-taught programmer, and while I strive to ensure its security and functionality, there may be issues that I have not foreseen.
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Account Termination</h2>
            <p>
              You may close your account at any time. Upon account closure, your data will be marked as deleted but will remain encrypted and stored in the database for security and record-keeping purposes.
            </p>
            <p>
              I reserve the right to terminate your account if you violate these Terms or engage in any activity that compromises the security or integrity of the App.
            </p>
          </section>

          <section>
            <h2>7. Disclaimer and Limitation of Liability</h2>
            <p>
              <strong>Medical Advice:</strong> The Health Tracker app is not a substitute for professional medical advice, diagnosis, or treatment.
              Always seek the advice of your physician or other qualified health providers with any questions you may have regarding a medical condition.
            </p>
            <p>
              <strong>Liability:</strong> To the fullest extent permitted by law, I am not liable for any direct, indirect, incidental, or consequential damages arising out of your use of the App.
              This includes any data breaches, inaccuracies, or other issues related to the App’s use.
            </p>
          </section>

          <section>
            <h2>8. Governing Law</h2>
            <p>
              As an open-source project, the Health Tracker app does not adhere to any specific jurisdiction's laws.
              However, users are responsible for ensuring that their use of the App complies with local laws and regulations.
            </p>
          </section>

          <section>
            <h2>9. Modifications to the Terms</h2>
            <p>
              I reserve the right to modify these Terms of Service as the App continues to develop and as I receive feedback from users.
              At this time, users will not be notified of changes to the Terms.
              Please review these Terms periodically to stay informed of any updates.
            </p>
          </section>

          <section>
            <h2>10. Contact Information</h2>
            <p>
              If you have any questions or concerns about these Terms, please feel free to contact me at <a href="https://www.linkedin.com/in/ichaidez/">LinkedIn</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Tos
