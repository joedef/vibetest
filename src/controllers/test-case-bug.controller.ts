import { Request, Response } from 'express';
import { TestCaseBugModel } from '../models/test-case-bug.model';

const testCaseBugModel = new TestCaseBugModel();

export const getAllLinks = async (req: Request, res: Response) => {
  try {
    const links = await testCaseBugModel.findAll();
    res.status(200).json(links);
  } catch (error) {
    console.error('Error getting all links:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLinkById = async (req: Request, res: Response) => {
  try {
    const linkId = parseInt(req.params.id);
    const link = await testCaseBugModel.findById(linkId);
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    res.status(200).json(link);
  } catch (error) {
    console.error('Error getting link by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createLink = async (req: Request, res: Response) => {
  try {
    const bugId = parseInt(req.params.bugId);
    const testCaseId = parseInt(req.params.testCaseId);
    
    const newLink = await testCaseBugModel.create(testCaseId, bugId);
    res.status(201).json(newLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  try {
    const linkId = parseInt(req.params.id);
    await testCaseBugModel.delete(linkId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBugsForTestCase = async (req: Request, res: Response) => {
  try {
    const { testCaseId } = req.params;
    const links = await testCaseBugModel.findByTestCaseId(Number(testCaseId));
    res.status(200).json(links);
  } catch (error) {
    console.error('Error getting bugs for test case:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTestCasesForBug = async (req: Request, res: Response) => {
  try {
    const { bugId } = req.params;
    const links = await testCaseBugModel.findByBugId(Number(bugId));
    res.status(200).json(links);
  } catch (error) {
    console.error('Error getting test cases for bug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 