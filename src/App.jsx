// React
import React from 'react';

// Relative
import { Route, Routes } from 'react-router';

// Relative
import ScrollToTop from './components/ScrollToTop';
import PageTitleManager from './components/PageTitleManager';
import MainLayout from './layouts/MainLayout';
import CaseStudyDetail from './pages/CaseStudyDetail';
import CaseStudies from './pages/CaseStudies';
import ReferenceDetail from './pages/ReferenceDetail';
import References from './pages/References';
import ComponentsShowcase from './pages/ComponentsShowcase';
import DeveloperTools from './pages/DeveloperTools';
import DSA from './pages/DSA';
import DSADetail from './pages/DSADetail';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import PrebuiltModuleDetail from './pages/PrebuiltModuleDetail';
import PrebuiltModules from './pages/PrebuiltModules';
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';

function App() {
  return (
    <>
      <ScrollToTop />
      <PageTitleManager />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/components" element={<ComponentsShowcase />} />
          <Route path="/dsa" element={<DSA />} />
          <Route path="/dsa/:id" element={<DSADetail />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="/references" element={<References />} />
          <Route path="/references/:id" element={<ReferenceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/modules" element={<PrebuiltModules />} />
          <Route path="/modules/:id" element={<PrebuiltModuleDetail />} />
          <Route path="/tools" element={<DeveloperTools />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
